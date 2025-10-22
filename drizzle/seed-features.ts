import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { propertyFeatures } from '../shared/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

const featuresData = [
  // المرافق
  { nameEn: 'Swimming Pool', nameAr: 'مسبح', category: 'amenities', level: 1, displayOrder: 1 },
  { nameEn: 'Gym', nameAr: 'صالة رياضية', category: 'amenities', level: 1, displayOrder: 2 },
  { nameEn: 'Parking', nameAr: 'موقف سيارات', category: 'amenities', level: 1, displayOrder: 3 },
  { nameEn: 'Garden', nameAr: 'حديقة', category: 'amenities', level: 1, displayOrder: 4 },
  { nameEn: 'Balcony', nameAr: 'شرفة', category: 'amenities', level: 1, displayOrder: 5 },
  { nameEn: 'Elevator', nameAr: 'مصعد', category: 'amenities', level: 1, displayOrder: 6 },
  { nameEn: 'Air Conditioning', nameAr: 'تكييف', category: 'amenities', level: 1, displayOrder: 7 },
  { nameEn: 'Central Heating', nameAr: 'تدفئة مركزية', category: 'amenities', level: 1, displayOrder: 8 },
  { nameEn: 'Furnished', nameAr: 'مفروش', category: 'amenities', level: 1, displayOrder: 9 },
  { nameEn: 'Kitchen Appliances', nameAr: 'أجهزة مطبخ', category: 'amenities', level: 1, displayOrder: 10 },
  { nameEn: 'Laundry Room', nameAr: 'غرفة غسيل', category: 'amenities', level: 1, displayOrder: 11 },
  { nameEn: 'Storage Room', nameAr: 'غرفة تخزين', category: 'amenities', level: 1, displayOrder: 12 },
  { nameEn: 'Maid Room', nameAr: 'غرفة خادمة', category: 'amenities', level: 1, displayOrder: 13 },
  { nameEn: 'Study Room', nameAr: 'غرفة دراسة', category: 'amenities', level: 1, displayOrder: 14 },
  { nameEn: 'Walk-in Closet', nameAr: 'خزانة ملابس', category: 'amenities', level: 1, displayOrder: 15 },

  // مميزات الموقع
  { nameEn: 'Near Hospital', nameAr: 'قريب من مستشفى', category: 'location', level: 1, displayOrder: 1 },
  { nameEn: 'Near School', nameAr: 'قريب من مدرسة', category: 'location', level: 1, displayOrder: 2 },
  { nameEn: 'Near Mall', nameAr: 'قريب من مول', category: 'location', level: 1, displayOrder: 3 },
  { nameEn: 'Near Metro', nameAr: 'قريب من المترو', category: 'location', level: 1, displayOrder: 4 },
  { nameEn: 'Near Beach', nameAr: 'قريب من الشاطئ', category: 'location', level: 1, displayOrder: 5 },
  { nameEn: 'Sea View', nameAr: 'مطل على البحر', category: 'location', level: 1, displayOrder: 6 },
  { nameEn: 'City View', nameAr: 'مطل على المدينة', category: 'location', level: 1, displayOrder: 7 },
  { nameEn: 'Park View', nameAr: 'مطل على الحديقة', category: 'location', level: 1, displayOrder: 8 },
  { nameEn: 'Golf View', nameAr: 'مطل على الجولف', category: 'location', level: 1, displayOrder: 9 },
  { nameEn: 'Marina View', nameAr: 'مطل على المارينا', category: 'location', level: 1, displayOrder: 10 },
  { nameEn: 'Near Airport', nameAr: 'قريب من المطار', category: 'location', level: 1, displayOrder: 11 },
  { nameEn: 'Near Mosque', nameAr: 'قريب من مسجد', category: 'location', level: 1, displayOrder: 12 },
  { nameEn: 'Quiet Area', nameAr: 'منطقة هادئة', category: 'location', level: 1, displayOrder: 13 },
  { nameEn: 'Central Location', nameAr: 'موقع مركزي', category: 'location', level: 1, displayOrder: 14 },

  // مميزات الأمان
  { nameEn: 'Security Guard', nameAr: 'حارس أمن', category: 'security', level: 1, displayOrder: 1 },
  { nameEn: 'CCTV', nameAr: 'كاميرات مراقبة', category: 'security', level: 1, displayOrder: 2 },
  { nameEn: 'Gated Community', nameAr: 'مجتمع مسور', category: 'security', level: 1, displayOrder: 3 },
  { nameEn: 'Access Card', nameAr: 'بطاقة دخول', category: 'security', level: 1, displayOrder: 4 },
  { nameEn: 'Intercom', nameAr: 'اتصال داخلي', category: 'security', level: 1, displayOrder: 5 },
  { nameEn: 'Fire Alarm', nameAr: 'إنذار حريق', category: 'security', level: 1, displayOrder: 6 },
  { nameEn: 'Smoke Detector', nameAr: 'كاشف دخان', category: 'security', level: 1, displayOrder: 7 },
  { nameEn: 'Emergency Exit', nameAr: 'مخرج طوارئ', category: 'security', level: 1, displayOrder: 8 },
  { nameEn: 'Safe Deposit', nameAr: 'خزنة آمنة', category: 'security', level: 1, displayOrder: 9 },
  { nameEn: 'Security System', nameAr: 'نظام أمني', category: 'security', level: 1, displayOrder: 10 }
];

async function seedFeatures() {
  console.log('🌱 ملء جدول المميزات...\n');

  try {
    // حذف البيانات الموجودة
    await db.delete(propertyFeatures);
    console.log('🗑️ تم حذف البيانات القديمة');

    // إدراج البيانات الجديدة
    for (const feature of featuresData) {
      await db.insert(propertyFeatures).values({
        nameEn: feature.nameEn,
        nameAr: feature.nameAr,
        category: feature.category,
        level: feature.level,
        displayOrder: feature.displayOrder,
        isActive: true
      });
    }

    console.log(`✅ تم إدراج ${featuresData.length} ميزة بنجاح!`);

    // عرض الإحصائيات
    const stats = await db.select().from(propertyFeatures);
    const amenitiesCount = stats.filter(f => f.category === 'amenities').length;
    const locationCount = stats.filter(f => f.category === 'location').length;
    const securityCount = stats.filter(f => f.category === 'security').length;

    console.log('\n📊 الإحصائيات:');
    console.log(`   المرافق: ${amenitiesCount}`);
    console.log(`   الموقع: ${locationCount}`);
    console.log(`   الأمان: ${securityCount}`);
    console.log(`   المجموع: ${stats.length}`);
    console.log('\n✅ تم توحيد المميزات بنجاح مع الفلاتر!');

  } catch (error) {
    console.error('❌ خطأ في ملء البيانات:', error);
    process.exit(1);
  } finally {
    await sqlClient.end();
  }
}

seedFeatures().catch(console.error);