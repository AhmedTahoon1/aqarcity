import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { emirates, areas, properties } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

// UAE Emirates and their areas
const uaeEmiratesData = [
  // Dubai
  {
    nameEn: 'Dubai',
    nameAr: 'دبي',
    areas: [
      { nameEn: 'Dubai Marina', nameAr: 'دبي مارينا' },
      { nameEn: 'Downtown Dubai', nameAr: 'وسط مدينة دبي' },
      { nameEn: 'Jumeirah Beach Residence', nameAr: 'شاطئ جميرا' },
      { nameEn: 'Palm Jumeirah', nameAr: 'نخلة جميرا' },
      { nameEn: 'Business Bay', nameAr: 'الخليج التجاري' },
      { nameEn: 'DIFC', nameAr: 'مركز دبي المالي العالمي' },
      { nameEn: 'Dubai Hills Estate', nameAr: 'دبي هيلز استيت' },
      { nameEn: 'Arabian Ranches', nameAr: 'المراعي العربية' },
      { nameEn: 'Dubai South', nameAr: 'دبي الجنوب' },
      { nameEn: 'Al Barsha', nameAr: 'البرشاء' }
    ]
  },
  // Abu Dhabi
  {
    nameEn: 'Abu Dhabi',
    nameAr: 'أبوظبي',
    areas: [
      { nameEn: 'Corniche Area', nameAr: 'منطقة الكورنيش' },
      { nameEn: 'Al Reem Island', nameAr: 'جزيرة الريم' },
      { nameEn: 'Saadiyat Island', nameAr: 'جزيرة السعديات' },
      { nameEn: 'Yas Island', nameAr: 'جزيرة ياس' },
      { nameEn: 'Al Khalidiyah', nameAr: 'الخالدية' },
      { nameEn: 'Al Zahiyah', nameAr: 'الظاهية' }
    ]
  },
  // Sharjah
  {
    nameEn: 'Sharjah',
    nameAr: 'الشارقة',
    areas: [
      { nameEn: 'Al Majaz', nameAr: 'الماجز' },
      { nameEn: 'Al Qasba', nameAr: 'القصباء' },
      { nameEn: 'Al Nahda', nameAr: 'النهدة' },
      { nameEn: 'Muweilah', nameAr: 'مويلح' }
    ]
  },
  // Ajman
  {
    nameEn: 'Ajman',
    nameAr: 'عجمان',
    areas: [
      { nameEn: 'Ajman Downtown', nameAr: 'وسط عجمان' },
      { nameEn: 'Al Nuaimiya', nameAr: 'النعيمية' }
    ]
  },
  // Ras Al Khaimah
  {
    nameEn: 'Ras Al Khaimah',
    nameAr: 'رأس الخيمة',
    areas: [
      { nameEn: 'Al Hamra', nameAr: 'الحمراء' },
      { nameEn: 'Mina Al Arab', nameAr: 'ميناء العرب' }
    ]
  },
  // Fujairah
  {
    nameEn: 'Fujairah',
    nameAr: 'الفجيرة',
    areas: [
      { nameEn: 'Fujairah City', nameAr: 'مدينة الفجيرة' }
    ]
  },
  // Umm Al Quwain
  {
    nameEn: 'Umm Al Quwain',
    nameAr: 'أم القيوين',
    areas: [
      { nameEn: 'UAQ City', nameAr: 'مدينة أم القيوين' }
    ]
  }
];

async function migrateEmiratesAndAreas() {
  console.log('🏗️ Starting emirates and areas migration...');

  try {
    // Insert emirates and areas
    for (const emirateData of uaeEmiratesData) {
      console.log(`📍 Creating emirate: ${emirateData.nameEn}`);
      
      // Insert emirate
      const [insertedEmirate] = await db.insert(emirates).values({
        nameEn: emirateData.nameEn,
        nameAr: emirateData.nameAr,
        isActive: true,
        displayOrder: uaeEmiratesData.indexOf(emirateData)
      }).returning();

      // Insert areas
      for (const areaData of emirateData.areas) {
        console.log(`  📍 Creating area: ${areaData.nameEn}`);
        await db.insert(areas).values({
          nameEn: areaData.nameEn,
          nameAr: areaData.nameAr,
          emirateId: insertedEmirate.id,
          isActive: true,
          displayOrder: emirateData.areas.indexOf(areaData)
        });
      }
    }

    console.log('✅ Emirates and areas migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run migration
migrateEmiratesAndAreas().catch(console.error);