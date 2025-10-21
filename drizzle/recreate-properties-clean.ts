import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties, agents } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

// عقارات نظيفة مع عناوين صحيحة
const cleanProperties = [
  // دبي - مارينا دبي
  { titleAr: 'شقة 2 غرف في مارينا دبي', titleEn: '2BR Apartment in Dubai Marina', location: 'Dubai Marina', emirate: 'Dubai', area: 'Dubai Marina', price: 1200000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
  { titleAr: 'بنتهاوس 3 غرف في مارينا دبي', titleEn: '3BR Penthouse in Dubai Marina', location: 'Dubai Marina', emirate: 'Dubai', area: 'Dubai Marina', price: 2500000, type: 'penthouse', bedrooms: 3, bathrooms: 3 },
  { titleAr: 'شقة 1 غرفة في مارينا دبي', titleEn: '1BR Apartment in Dubai Marina', location: 'Dubai Marina', emirate: 'Dubai', area: 'Dubai Marina', price: 900000, type: 'apartment', bedrooms: 1, bathrooms: 1 },
  
  // دبي - وسط مدينة دبي
  { titleAr: 'شقة 2 غرف في وسط مدينة دبي', titleEn: '2BR Apartment in Downtown Dubai', location: 'Downtown Dubai', emirate: 'Dubai', area: 'Downtown Dubai', price: 1800000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
  { titleAr: 'بنتهاوس 4 غرف في وسط مدينة دبي', titleEn: '4BR Penthouse in Downtown Dubai', location: 'Downtown Dubai', emirate: 'Dubai', area: 'Downtown Dubai', price: 4500000, type: 'penthouse', bedrooms: 4, bathrooms: 4 },
  
  // دبي - نخلة جميرا
  { titleAr: 'فيلا 4 غرف في نخلة جميرا', titleEn: '4BR Villa in Palm Jumeirah', location: 'Palm Jumeirah', emirate: 'Dubai', area: 'Palm Jumeirah', price: 6000000, type: 'villa', bedrooms: 4, bathrooms: 5 },
  { titleAr: 'شقة 3 غرف في نخلة جميرا', titleEn: '3BR Apartment in Palm Jumeirah', location: 'Palm Jumeirah', emirate: 'Dubai', area: 'Palm Jumeirah', price: 2800000, type: 'apartment', bedrooms: 3, bathrooms: 3 },
  
  // دبي - الخليج التجاري
  { titleAr: 'شقة 2 غرف في الخليج التجاري', titleEn: '2BR Apartment in Business Bay', location: 'Business Bay', emirate: 'Dubai', area: 'Business Bay', price: 1400000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
  { titleAr: 'مكتب في الخليج التجاري', titleEn: 'Office in Business Bay', location: 'Business Bay', emirate: 'Dubai', area: 'Business Bay', price: 800000, type: 'apartment', bedrooms: 0, bathrooms: 1 },
  
  // دبي - جميرا
  { titleAr: 'فيلا 5 غرف في جميرا', titleEn: '5BR Villa in Jumeirah', location: 'Jumeirah', emirate: 'Dubai', area: 'Jumeirah', price: 8000000, type: 'villa', bedrooms: 5, bathrooms: 6 },
  { titleAr: 'تاون هاوس 3 غرف في جميرا', titleEn: '3BR Townhouse in Jumeirah', location: 'Jumeirah', emirate: 'Dubai', area: 'Jumeirah', price: 3500000, type: 'townhouse', bedrooms: 3, bathrooms: 4 },
  
  // أبوظبي - جزيرة السعديات
  { titleAr: 'شقة 2 غرف في جزيرة السعديات', titleEn: '2BR Apartment in Saadiyat Island', location: 'Saadiyat Island', emirate: 'Abu Dhabi', area: 'Saadiyat Island', price: 1600000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
  { titleAr: 'فيلا 4 غرف في جزيرة السعديات', titleEn: '4BR Villa in Saadiyat Island', location: 'Saadiyat Island', emirate: 'Abu Dhabi', area: 'Saadiyat Island', price: 5500000, type: 'villa', bedrooms: 4, bathrooms: 5 },
  
  // أبوظبي - جزيرة ياس
  { titleAr: 'شقة 3 غرف في جزيرة ياس', titleEn: '3BR Apartment in Yas Island', location: 'Yas Island', emirate: 'Abu Dhabi', area: 'Yas Island', price: 2200000, type: 'apartment', bedrooms: 3, bathrooms: 3 },
  { titleAr: 'تاون هاوس 4 غرف في جزيرة ياس', titleEn: '4BR Townhouse in Yas Island', location: 'Yas Island', emirate: 'Abu Dhabi', area: 'Yas Island', price: 4200000, type: 'townhouse', bedrooms: 4, bathrooms: 4 },
  
  // الشارقة - النهدة
  { titleAr: 'شقة 2 غرف في النهدة', titleEn: '2BR Apartment in Al Nahda', location: 'Al Nahda', emirate: 'Sharjah', area: 'Al Nahda', price: 650000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
  { titleAr: 'شقة 3 غرف في النهدة', titleEn: '3BR Apartment in Al Nahda', location: 'Al Nahda', emirate: 'Sharjah', area: 'Al Nahda', price: 850000, type: 'apartment', bedrooms: 3, bathrooms: 2 },
  
  // عجمان
  { titleAr: 'شقة 1 غرفة في عجمان', titleEn: '1BR Apartment in Ajman', location: 'Ajman City', emirate: 'Ajman', area: 'Ajman', price: 350000, type: 'apartment', bedrooms: 1, bathrooms: 1 },
  { titleAr: 'شقة 2 غرف في عجمان', titleEn: '2BR Apartment in Ajman', location: 'Ajman City', emirate: 'Ajman', area: 'Ajman', price: 450000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
];

async function recreateCleanProperties() {
  console.log('🧹 إعادة إنشاء العقارات بعناوين صحيحة...\n');

  try {
    // 1. حذف جميع العقارات الموجودة
    await db.delete(properties);
    console.log('🗑️ تم حذف جميع العقارات القديمة');

    // 2. جلب الوكيل الافتراضي
    const defaultAgent = await db.select().from(agents).limit(1);
    const agentId = defaultAgent.length > 0 ? defaultAgent[0].id : null;

    // 3. جلب العناوين
    const allAddresses = await db.select().from(addresses);
    const addressMap = new Map();
    allAddresses.forEach(addr => {
      addressMap.set(addr.nameEn, addr.id);
      addressMap.set(addr.nameAr, addr.id);
    });

    // 4. إنشاء العقارات الجديدة
    let createdCount = 0;
    for (const prop of cleanProperties) {
      // البحث عن العنوان الصحيح
      let addressId = addressMap.get(prop.area);
      
      // إذا لم نجد العنوان، نبحث في الإمارة
      if (!addressId) {
        addressId = addressMap.get(prop.emirate);
      }

      if (addressId) {
        await db.insert(properties).values({
          referenceNumber: `REF-${Date.now()}-${createdCount}`,
          titleEn: prop.titleEn,
          titleAr: prop.titleAr,
          descriptionEn: `Beautiful ${prop.type} in ${prop.location}`,
          descriptionAr: `${prop.titleAr} في موقع مميز`,
          location: `${prop.location}, ${prop.emirate}`,
          addressId: addressId,
          areaName: prop.area,
          price: prop.price.toString(),
          status: Math.random() > 0.5 ? 'sale' : 'rent',
          propertyType: prop.type as any,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          areaSqft: Math.floor(Math.random() * 2000) + 800,
          agentId: agentId,
          images: [`https://via.placeholder.com/800x600?text=${prop.type}`],
          features: {
            amenities: ['Swimming Pool', 'Gym', 'Parking'],
            location: ['Near Metro', 'Shopping Mall'],
            security: ['24/7 Security', 'CCTV']
          }
        });

        console.log(`✅ تم إنشاء: ${prop.titleAr} في ${prop.area}`);
        createdCount++;
      }
    }

    console.log(`\n🎉 تم إنشاء ${createdCount} عقار بعناوين صحيحة!`);

  } catch (error) {
    console.error('❌ خطأ في إعادة الإنشاء:', error);
  } finally {
    await sqlClient.end();
  }
}

recreateCleanProperties().catch(console.error);