import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { propertyFeatures } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function testFeaturesSystem() {
  console.log('🧪 اختبار نظام إدارة المميزات...\n');

  try {
    // 1. اختبار جلب جميع المميزات
    console.log('1️⃣ اختبار جلب المميزات:');
    const allFeatures = await db.select().from(propertyFeatures).orderBy(propertyFeatures.category, propertyFeatures.displayOrder);
    
    const grouped = allFeatures.reduce((acc, feature) => {
      if (!acc[feature.category]) acc[feature.category] = [];
      acc[feature.category].push(feature);
      return acc;
    }, {} as Record<string, any[]>);

    console.log(`   ✅ تم جلب ${allFeatures.length} ميزة`);
    console.log(`   📊 المرافق: ${grouped.amenities?.length || 0}`);
    console.log(`   📊 الموقع: ${grouped.location?.length || 0}`);
    console.log(`   📊 الأمان: ${grouped.security?.length || 0}`);

    // 2. اختبار إضافة ميزة جديدة
    console.log('\n2️⃣ اختبار إضافة ميزة جديدة:');
    const newFeature = await db.insert(propertyFeatures).values({
      nameEn: 'Test Feature',
      nameAr: 'ميزة تجريبية',
      category: 'amenities',
      level: 1,
      displayOrder: 999,
      isActive: true
    }).returning();

    console.log(`   ✅ تم إضافة ميزة: ${newFeature[0].nameEn}`);

    // 3. اختبار تعديل الميزة
    console.log('\n3️⃣ اختبار تعديل الميزة:');
    const updatedFeature = await db.update(propertyFeatures)
      .set({
        nameEn: 'Updated Test Feature',
        nameAr: 'ميزة تجريبية محدثة',
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(propertyFeatures.id, newFeature[0].id))
      .returning();

    console.log(`   ✅ تم تعديل الميزة: ${updatedFeature[0].nameEn}`);
    console.log(`   📊 الحالة: ${updatedFeature[0].isActive ? 'نشط' : 'غير نشط'}`);

    // 4. اختبار تبديل الحالة
    console.log('\n4️⃣ اختبار تبديل الحالة:');
    const toggledFeature = await db.update(propertyFeatures)
      .set({
        isActive: !updatedFeature[0].isActive,
        updatedAt: new Date()
      })
      .where(eq(propertyFeatures.id, newFeature[0].id))
      .returning();

    console.log(`   ✅ تم تبديل الحالة: ${toggledFeature[0].isActive ? 'نشط' : 'غير نشط'}`);

    // 5. اختبار حذف الميزة
    console.log('\n5️⃣ اختبار حذف الميزة:');
    const deletedFeature = await db.delete(propertyFeatures)
      .where(eq(propertyFeatures.id, newFeature[0].id))
      .returning();

    console.log(`   ✅ تم حذف الميزة: ${deletedFeature[0].nameEn}`);

    // 6. اختبار تنسيق البيانات للواجهة الأمامية
    console.log('\n6️⃣ اختبار تنسيق البيانات للواجهة الأمامية:');
    const activeFeatures = await db.select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.isActive, true))
      .orderBy(propertyFeatures.category, propertyFeatures.displayOrder);

    const frontendFormat = {
      amenities: activeFeatures.filter(f => f.category === 'amenities').map(f => ({
        id: f.nameEn.toLowerCase().replace(/\s+/g, '_'),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      })),
      location: activeFeatures.filter(f => f.category === 'location').map(f => ({
        id: f.nameEn.toLowerCase().replace(/\s+/g, '_'),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      })),
      security: activeFeatures.filter(f => f.category === 'security').map(f => ({
        id: f.nameEn.toLowerCase().replace(/\s+/g, '_'),
        nameEn: f.nameEn,
        nameAr: f.nameAr
      }))
    };

    console.log(`   ✅ تم تنسيق البيانات للواجهة الأمامية`);
    console.log(`   📊 المرافق النشطة: ${frontendFormat.amenities.length}`);
    console.log(`   📊 مميزات الموقع النشطة: ${frontendFormat.location.length}`);
    console.log(`   📊 مميزات الأمان النشطة: ${frontendFormat.security.length}`);

    console.log('\n🎉 جميع الاختبارات نجحت! النظام يعمل بشكل صحيح.');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await sqlClient.end();
  }
}

testFeaturesSystem().catch(console.error);