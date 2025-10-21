import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties } from '../shared/schema.js';
import { eq, ilike, or } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

// خريطة ربط المواقع بالعناوين الصحيحة
const locationMapping = {
  // دبي
  'دبي مارينا': 'Dubai Marina',
  'مارينا دبي': 'Dubai Marina', 
  'شاطئ جميرا': 'JBR - Jumeirah Beach Residence',
  'وسط مدينة دبي': 'Downtown Dubai',
  'نخلة جميرا': 'Palm Jumeirah',
  'الخليج التجاري': 'Business Bay',
  'ديرة': 'Jumeirah', // تصحيح ديرة إلى جميرا
  
  // أبوظبي
  'جزيرة السعديات': 'Saadiyat Island',
  'جزيرة ياس': 'Yas Island',
  'منطقة الكورنيش': 'Corniche Area',
  
  // الشارقة
  'النهدة': 'Al Nahda',
  'المجاز': 'Al Majaz',
  'القصباء': 'Al Qasba'
};

async function fixPropertyAddresses() {
  console.log('🔧 إصلاح عناوين العقارات...\n');

  try {
    // جلب جميع العقارات مع عناوينها
    const propertiesWithAddresses = await db.select({
      propertyId: properties.id,
      propertyLocation: properties.location,
      addressId: properties.addressId,
      addressName: addresses.nameEn,
      addressNameAr: addresses.nameAr
    })
    .from(properties)
    .leftJoin(addresses, eq(properties.addressId, addresses.id));

    console.log(`📊 إجمالي العقارات: ${propertiesWithAddresses.length}\n`);

    let fixedCount = 0;

    for (const prop of propertiesWithAddresses) {
      // استخراج اسم المنطقة من الموقع المحفوظ
      const locationParts = prop.propertyLocation.split(',');
      const areaName = locationParts[0]?.trim();
      
      if (!areaName) continue;

      // البحث عن العنوان الصحيح
      const correctEnglishName = locationMapping[areaName] || areaName;
      
      // البحث في قاعدة البيانات عن العنوان الصحيح
      const correctAddress = await db.select()
        .from(addresses)
        .where(or(
          ilike(addresses.nameEn, `%${correctEnglishName}%`),
          ilike(addresses.nameAr, `%${areaName}%`)
        ))
        .limit(1);

      if (correctAddress.length > 0 && correctAddress[0].id !== prop.addressId) {
        // تحديث العقار بالعنوان الصحيح
        await db.update(properties)
          .set({ addressId: correctAddress[0].id })
          .where(eq(properties.id, prop.propertyId));

        console.log(`✅ تم إصلاح: ${areaName}`);
        console.log(`   من: ${prop.addressNameAr} → إلى: ${correctAddress[0].nameAr}`);
        fixedCount++;
      }
    }

    console.log(`\n🎉 تم إصلاح ${fixedCount} عقار`);

  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error);
  } finally {
    await sqlClient.end();
  }
}

fixPropertyAddresses().catch(console.error);