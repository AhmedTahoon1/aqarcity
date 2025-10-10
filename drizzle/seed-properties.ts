import { db } from '../db';
import { properties, agents, developers } from '../shared/schema';

// بيانات المواقع مباشرة
const uaeLocations = [
  { id: 'dubai', name: 'دبي', nameEn: 'Dubai', type: 'emirate' },
  { id: 'abu-dhabi', name: 'أبوظبي', nameEn: 'Abu Dhabi', type: 'emirate' },
  { id: 'sharjah', name: 'الشارقة', nameEn: 'Sharjah', type: 'emirate' },
  { id: 'ajman', name: 'عجمان', nameEn: 'Ajman', type: 'emirate' },
  { id: 'rak', name: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', type: 'emirate' },
  { id: 'fujairah', name: 'الفجيرة', nameEn: 'Fujairah', type: 'emirate' },
  { id: 'uaq', name: 'أم القيوين', nameEn: 'Umm Al Quwain', type: 'emirate' },
  { id: 'dubai-marina', name: 'دبي مارينا', nameEn: 'Dubai Marina', type: 'city', parent: 'dubai' },
  { id: 'downtown-dubai', name: 'وسط مدينة دبي', nameEn: 'Downtown Dubai', type: 'city', parent: 'dubai' },
  { id: 'jbr', name: 'شاطئ جميرا', nameEn: 'Jumeirah Beach Residence', type: 'city', parent: 'dubai' },
  { id: 'palm-jumeirah', name: 'نخلة جميرا', nameEn: 'Palm Jumeirah', type: 'city', parent: 'dubai' },
  { id: 'business-bay', name: 'الخليج التجاري', nameEn: 'Business Bay', type: 'city', parent: 'dubai' },
  { id: 'jumeirah', name: 'جميرا', nameEn: 'Jumeirah', type: 'city', parent: 'dubai' },
  { id: 'deira', name: 'ديرة', nameEn: 'Deira', type: 'city', parent: 'dubai' },
  { id: 'bur-dubai', name: 'بر دبي', nameEn: 'Bur Dubai', type: 'city', parent: 'dubai' },
  { id: 'abu-dhabi-city', name: 'مدينة أبوظبي', nameEn: 'Abu Dhabi City', type: 'city', parent: 'abu-dhabi' },
  { id: 'al-ain', name: 'العين', nameEn: 'Al Ain', type: 'city', parent: 'abu-dhabi' },
  { id: 'yas-island', name: 'جزيرة ياس', nameEn: 'Yas Island', type: 'city', parent: 'abu-dhabi' },
  { id: 'saadiyat-island', name: 'جزيرة السعديات', nameEn: 'Saadiyat Island', type: 'city', parent: 'abu-dhabi' },
  { id: 'sharjah-city', name: 'مدينة الشارقة', nameEn: 'Sharjah City', type: 'city', parent: 'sharjah' },
  { id: 'al-majaz', name: 'الماجز', nameEn: 'Al Majaz', type: 'city', parent: 'sharjah' },
  { id: 'al-nahda', name: 'النهدة', nameEn: 'Al Nahda', type: 'city', parent: 'sharjah' },
  { id: 'ajman-city', name: 'مدينة عجمان', nameEn: 'Ajman City', type: 'city', parent: 'ajman' },
  { id: 'rak-city', name: 'مدينة رأس الخيمة', nameEn: 'Ras Al Khaimah City', type: 'city', parent: 'rak' },
  { id: 'fujairah-city', name: 'مدينة الفجيرة', nameEn: 'Fujairah City', type: 'city', parent: 'fujairah' },
  { id: 'uaq-city', name: 'مدينة أم القيوين', nameEn: 'Umm Al Quwain City', type: 'city', parent: 'uaq' }
] as const;

const propertyTypes = ['villa', 'apartment', 'townhouse', 'penthouse'];
const statuses = ['sale', 'rent'];

const sampleDescriptions = [
  'عقار فاخر في موقع مميز مع إطلالة رائعة وتشطيبات عالية الجودة',
  'شقة حديثة مع جميع المرافق والخدمات في منطقة حيوية',
  'فيلا واسعة مع حديقة خاصة ومسبح في مجتمع هادئ وآمن',
  'بنتهاوس فاخر مع تراس كبير وإطلالة بانورامية على المدينة',
  'تاون هاوس عصري مع تصميم معماري متميز ومساحات واسعة'
];

const amenities = [
  'مسبح', 'جيم', 'حديقة', 'موقف سيارات', 'أمن 24/7', 'مصعد', 'بلكونة', 'غرفة خادمة'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(propertyType: string, status: string): string {
  const basePrice = propertyType === 'villa' ? 2000000 : 
                   propertyType === 'penthouse' ? 1500000 :
                   propertyType === 'townhouse' ? 1200000 : 800000;
  
  const multiplier = status === 'rent' ? 0.05 : 1;
  const variation = 0.3; // ±30% variation
  
  const price = basePrice * multiplier * (1 + (Math.random() - 0.5) * variation);
  return Math.round(price).toString();
}

async function seedProperties() {
  console.log('🌱 بدء إضافة العقارات التجريبية...');

  // الحصول على المدن فقط (ليس الإمارات)
  const cities = uaeLocations.filter(location => location.type === 'city');
  
  // إنشاء وكيل تجريبي (بدون user_id)
  const sampleAgent = await db.insert(agents).values({
    name: 'أحمد محمد العلي',
    email: 'ahmed.ali@aqarcity.ae',
    phone: '+971501234567',
    whatsapp: '+971501234567',
    bio: 'وكيل عقاري معتمد مع خبرة 10 سنوات في السوق الإماراتي',
    isVerified: true,
    rating: 4.8,
    totalReviews: 156,
    totalSales: 89,
    userId: null // مؤقتاً للاختبار
  }).returning();

  // إنشاء مطور تجريبي
  const sampleDeveloper = await db.insert(developers).values({
    name: 'شركة الإمارات للتطوير العقاري',
    email: 'info@emiratesdevelopment.ae',
    phone: '+971501234568',
    website: 'https://emiratesdevelopment.ae',
    description: 'شركة رائدة في التطوير العقاري بالإمارات مع مشاريع متميزة',
    isVerified: true,
    rating: 4.9,
    totalProjects: 25
  }).returning();

  const agentId = sampleAgent[0].id;
  const developerId = sampleDeveloper[0].id;

  let totalProperties = 0;

  // إضافة عقارات لكل مدينة
  for (const city of cities) {
    const emirate = uaeLocations.find(e => e.id === city.parent);
    if (!emirate) continue;

    // إضافة 3-5 عقارات لكل مدينة
    const propertiesCount = getRandomNumber(3, 5);
    
    for (let i = 0; i < propertiesCount; i++) {
      const propertyType = getRandomElement(propertyTypes);
      const status = getRandomElement(statuses);
      const bedrooms = getRandomNumber(1, 5);
      const bathrooms = getRandomNumber(1, 4);
      const areaSqft = getRandomNumber(800, 4000);
      
      const property = {
        title: `${propertyType === 'villa' ? 'فيلا' : 
                propertyType === 'apartment' ? 'شقة' : 
                propertyType === 'townhouse' ? 'تاون هاوس' : 'بنتهاوس'} ${bedrooms} غرف في ${city.name}`,
        description: getRandomElement(sampleDescriptions),
        propertyType: propertyType as any,
        status: status as any,
        price: getRandomPrice(propertyType, status),
        city: emirate.name,
        areaName: city.name,
        address: `شارع ${getRandomNumber(1, 50)}, ${city.name}, ${emirate.name}`,
        bedrooms,
        bathrooms,
        areaSqft,
        yearBuilt: getRandomNumber(2015, 2024),
        parkingSpaces: getRandomNumber(1, 3),
        furnished: Math.random() > 0.5,
        petFriendly: Math.random() > 0.7,
        amenities: amenities.slice(0, getRandomNumber(3, 6)),
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
        ],
        virtualTourUrl: Math.random() > 0.7 ? 'https://example.com/virtual-tour' : null,
        latitude: 25.2048 + (Math.random() - 0.5) * 0.5,
        longitude: 55.2708 + (Math.random() - 0.5) * 0.5,
        isFeatured: Math.random() > 0.8,
        isActive: true,
        viewsCount: getRandomNumber(10, 500),
        agentId,
        developerId: Math.random() > 0.5 ? developerId : null
      };

      await db.insert(properties).values(property);
      totalProperties++;
    }

    console.log(`✅ تم إضافة ${propertiesCount} عقارات في ${city.name}, ${emirate.name}`);
  }

  console.log(`🎉 تم إضافة ${totalProperties} عقار تجريبي بنجاح!`);
  console.log(`📊 التوزيع: ${cities.length} مدينة × 3-5 عقارات لكل مدينة`);
}

// تشغيل السكريبت
seedProperties()
  .then(() => {
    console.log('✅ انتهى إنشاء العقارات التجريبية');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطأ في إنشاء العقارات:', error);
    process.exit(1);
  });