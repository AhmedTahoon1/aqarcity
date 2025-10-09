import { db } from '../db.js';
import { locations } from '../shared/schema.js';

const uaeLocations = [
  // Dubai
  { nameEn: 'Downtown Dubai', nameAr: 'وسط مدينة دبي', city: 'Dubai', displayOrder: 1 },
  { nameEn: 'Dubai Marina', nameAr: 'مرسى دبي', city: 'Dubai', displayOrder: 2 },
  { nameEn: 'Jumeirah Beach Residence (JBR)', nameAr: 'جميرا بيتش ريزيدنس', city: 'Dubai', displayOrder: 3 },
  { nameEn: 'Palm Jumeirah', nameAr: 'نخلة جميرا', city: 'Dubai', displayOrder: 4 },
  { nameEn: 'Business Bay', nameAr: 'الخليج التجاري', city: 'Dubai', displayOrder: 5 },
  { nameEn: 'Dubai Hills Estate', nameAr: 'دبي هيلز استيت', city: 'Dubai', displayOrder: 6 },
  { nameEn: 'Arabian Ranches', nameAr: 'المراعي العربية', city: 'Dubai', displayOrder: 7 },
  { nameEn: 'Jumeirah Village Circle (JVC)', nameAr: 'دائرة قرية جميرا', city: 'Dubai', displayOrder: 8 },
  { nameEn: 'Dubai South', nameAr: 'دبي الجنوب', city: 'Dubai', displayOrder: 9 },
  { nameEn: 'DIFC', nameAr: 'مركز دبي المالي العالمي', city: 'Dubai', displayOrder: 10 },

  // Abu Dhabi
  { nameEn: 'Corniche Area', nameAr: 'منطقة الكورنيش', city: 'Abu Dhabi', displayOrder: 11 },
  { nameEn: 'Saadiyat Island', nameAr: 'جزيرة السعديات', city: 'Abu Dhabi', displayOrder: 12 },
  { nameEn: 'Yas Island', nameAr: 'جزيرة ياس', city: 'Abu Dhabi', displayOrder: 13 },
  { nameEn: 'Al Reem Island', nameAr: 'جزيرة الريم', city: 'Abu Dhabi', displayOrder: 14 },
  { nameEn: 'Masdar City', nameAr: 'مدينة مصدر', city: 'Abu Dhabi', displayOrder: 15 },

  // Sharjah
  { nameEn: 'Al Majaz', nameAr: 'المجاز', city: 'Sharjah', displayOrder: 16 },
  { nameEn: 'Al Nahda', nameAr: 'النهدة', city: 'Sharjah', displayOrder: 17 },
  { nameEn: 'Muwailih', nameAr: 'مويلح', city: 'Sharjah', displayOrder: 18 },

  // Ajman
  { nameEn: 'Ajman Downtown', nameAr: 'وسط عجمان', city: 'Ajman', displayOrder: 19 },
  { nameEn: 'Al Nuaimiya', nameAr: 'النعيمية', city: 'Ajman', displayOrder: 20 },

  // Other Emirates
  { nameEn: 'Ras Al Khaimah City', nameAr: 'مدينة رأس الخيمة', city: 'Ras Al Khaimah', displayOrder: 21 },
  { nameEn: 'Fujairah City', nameAr: 'مدينة الفجيرة', city: 'Fujairah', displayOrder: 22 },
  { nameEn: 'Umm Al Quwain City', nameAr: 'مدينة أم القيوين', city: 'Umm Al Quwain', displayOrder: 23 },
];

async function seedLocations() {
  try {
    console.log('🌍 Seeding locations...');
    
    await db.insert(locations).values(uaeLocations);
    
    console.log('✅ Locations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    process.exit(1);
  }
}

seedLocations();