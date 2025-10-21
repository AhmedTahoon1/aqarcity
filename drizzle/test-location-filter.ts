import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties } from '../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function testLocationFiltering() {
  console.log('🔍 اختبار فلترة المواقع الهرمية...\n');

  try {
    // 1. جلب جميع الإمارات (Level 0)
    const emirates = await db.select().from(addresses)
      .where(eq(addresses.level, 0))
      .orderBy(addresses.displayOrder);

    console.log('📍 الإمارات الموجودة:');
    emirates.forEach(emirate => {
      console.log(`  - ${emirate.nameAr} (${emirate.nameEn}) - ID: ${emirate.id}`);
    });

    // 2. اختبار كل إمارة
    for (const emirate of emirates) {
      console.log(`\n🏙️ اختبار إمارة: ${emirate.nameAr}`);
      
      // جلب المناطق الفرعية للإمارة
      const areas = await db.select().from(addresses)
        .where(eq(addresses.parentId, emirate.id))
        .orderBy(addresses.displayOrder);

      console.log(`  📊 عدد المناطق الفرعية: ${areas.length}`);
      
      // جلب العقارات المرتبطة مباشرة بالإمارة
      const directProperties = await db.select({ count: sql`count(*)` })
        .from(properties)
        .where(eq(properties.addressId, emirate.id));

      console.log(`  🏠 العقارات المرتبطة مباشرة: ${directProperties[0].count}`);

      // جلب العقارات في جميع المناطق الفرعية (الطريقة الحالية)
      const allPropertiesQuery = await db.select({ 
        count: sql`count(*)`,
        addressId: properties.addressId,
        addressName: addresses.nameAr
      })
        .from(properties)
        .leftJoin(addresses, eq(properties.addressId, addresses.id))
        .where(sql`(
          ${properties.addressId} = ${emirate.id} OR 
          ${properties.addressId} IN (
            WITH RECURSIVE address_tree AS (
              SELECT id FROM addresses WHERE parent_id = ${emirate.id}
              UNION ALL
              SELECT a.id FROM addresses a
              INNER JOIN address_tree at ON a.parent_id = at.id
            )
            SELECT id FROM address_tree
          )
        )`)
        .groupBy(properties.addressId, addresses.nameAr);

      console.log(`  🏘️ إجمالي العقارات (مع الفرعية): ${allPropertiesQuery.length} مجموعة`);
      
      // عرض تفاصيل العقارات حسب المنطقة
      if (allPropertiesQuery.length > 0) {
        console.log('  📋 توزيع العقارات:');
        allPropertiesQuery.forEach(result => {
          console.log(`    - ${result.addressName || 'غير محدد'}: ${result.count} عقار`);
        });
      }

      // اختبار المناطق الفرعية
      for (const area of areas.slice(0, 2)) { // اختبار أول منطقتين فقط
        console.log(`\n  🏢 اختبار منطقة: ${area.nameAr}`);
        
        const areaProperties = await db.select({ count: sql`count(*)` })
          .from(properties)
          .where(sql`(
            ${properties.addressId} = ${area.id} OR 
            ${properties.addressId} IN (
              WITH RECURSIVE address_tree AS (
                SELECT id FROM addresses WHERE parent_id = ${area.id}
                UNION ALL
                SELECT a.id FROM addresses a
                INNER JOIN address_tree at ON a.parent_id = at.id
              )
              SELECT id FROM address_tree
            )
          )`);

        console.log(`    🏠 عقارات المنطقة: ${areaProperties[0].count}`);

        // جلب المناطق الفرعية للمنطقة
        const subAreas = await db.select().from(addresses)
          .where(eq(addresses.parentId, area.id));

        if (subAreas.length > 0) {
          console.log(`    📍 المناطق الفرعية: ${subAreas.length}`);
          subAreas.forEach(subArea => {
            console.log(`      - ${subArea.nameAr}`);
          });
        }
      }
    }

    // 3. اختبار عينة من العقارات وعناوينها
    console.log('\n🏠 اختبار عينة من العقارات:');
    const sampleProperties = await db.select({
      propertyTitle: properties.titleAr,
      propertyLocation: properties.location,
      addressName: addresses.nameAr,
      addressLevel: addresses.level,
      addressPath: addresses.path
    })
      .from(properties)
      .leftJoin(addresses, eq(properties.addressId, addresses.id))
      .limit(10);

    sampleProperties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.propertyTitle}`);
      console.log(`   📍 الموقع المحفوظ: ${prop.propertyLocation}`);
      console.log(`   🏷️ العنوان المرتبط: ${prop.addressName} (مستوى ${prop.addressLevel})`);
      console.log(`   🛤️ المسار: ${prop.addressPath}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await sqlClient.end();
  }
}

testLocationFiltering().catch(console.error);