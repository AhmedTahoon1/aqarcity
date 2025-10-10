import { db } from '../db';
import { properties } from '../shared/schema';

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
  const price = basePrice * multiplier * (1 + (Math.random() - 0.5) * 0.3);
  return Math.round(price).toString();
}

async function seedSimpleProperties() {
  console.log('🌱 بدء إضافة العقارات التجريبية...');

  const cities = uaeLocations.filter(location => location.type === 'city');
  let totalProperties = 0;

  for (const city of cities) {
    const emirate = uaeLocations.find(e => e.id === city.parent);
    if (!emirate) continue;

    const propertiesCount = getRandomNumber(2, 4);
    
    for (let i = 0; i < propertiesCount; i++) {
      const propertyType = getRandomElement(propertyTypes);
      const status = getRandomElement(statuses);
      const bedrooms = getRandomNumber(1, 5);
      const bathrooms = getRandomNumber(1, 4);
      const areaSqft = getRandomNumber(800, 4000);
      
      const titleAr = `${propertyType === 'villa' ? 'فيلا' : 
                propertyType === 'apartment' ? 'شقة' : 
                propertyType === 'townhouse' ? 'تاون هاوس' : 'بنتهاوس'} ${bedrooms} غرف في ${city.name}`;
      const titleEn = `${propertyType === 'villa' ? 'Villa' : 
                propertyType === 'apartment' ? 'Apartment' : 
                propertyType === 'townhouse' ? 'Townhouse' : 'Penthouse'} ${bedrooms} BR in ${city.nameEn}`;
      
      const property = {
        title: titleAr,
        titleAr: titleAr,
        titleEn: titleEn,
        description: 'عقار فاخر في موقع مميز مع إطلالة رائعة وتشطيبات عالية الجودة',
        descriptionAr: 'عقار فاخر في موقع مميز مع إطلالة رائعة وتشطيبات عالية الجودة',
        descriptionEn: 'Luxury property in prime location with stunning views and high-quality finishes',
        propertyType: propertyType as any,
        status: status as any,
        price: getRandomPrice(propertyType, status),
        city: emirate.name,
        areaName: city.name,
        address: `شارع ${getRandomNumber(1, 50)}, ${city.name}, ${emirate.name}`,
        location: `${city.name}, ${emirate.name}`,
        referenceNumber: `AC${Date.now()}${getRandomNumber(100, 999)}`,
        bedrooms,
        bathrooms,
        areaSqft,
        yearBuilt: getRandomNumber(2015, 2024),
        parkingSpaces: getRandomNumber(1, 3),
        furnished: Math.random() > 0.5,
        petFriendly: Math.random() > 0.7,
        amenities: ['مسبح', 'جيم', 'حديقة', 'موقف سيارات'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ],
        latitude: 25.2048 + (Math.random() - 0.5) * 0.5,
        longitude: 55.2708 + (Math.random() - 0.5) * 0.5,
        isFeatured: Math.random() > 0.8,
        isActive: true,
        viewsCount: getRandomNumber(10, 500)
      };

      await db.insert(properties).values(property);
      totalProperties++;
    }

    console.log(`✅ تم إضافة ${propertiesCount} عقارات في ${city.name}, ${emirate.name}`);
  }

  console.log(`🎉 تم إضافة ${totalProperties} عقار تجريبي بنجاح!`);
}

seedSimpleProperties()
  .then(() => {
    console.log('✅ انتهى إنشاء العقارات التجريبية');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ خطأ في إنشاء العقارات:', error);
    process.exit(1);
  });