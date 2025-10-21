import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties, agents } from '../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

// مناطق جديدة لدبي
const newDubaiAreas = [
  { nameEn: 'Dubai Hills Estate', nameAr: 'دبي هيلز استيت', level: 1, path: '/dubai/dubai-hills' },
  { nameEn: 'Arabian Ranches', nameAr: 'المراعي العربية', level: 1, path: '/dubai/arabian-ranches' },
  { nameEn: 'JBR - Jumeirah Beach Residence', nameAr: 'جميرا بيتش ريزيدنس', level: 1, path: '/dubai/jbr' },
  { nameEn: 'DIFC', nameAr: 'مركز دبي المالي العالمي', level: 1, path: '/dubai/difc' },
  { nameEn: 'Dubai South', nameAr: 'دبي الجنوب', level: 1, path: '/dubai/dubai-south' },
  { nameEn: 'Al Barsha', nameAr: 'البرشاء', level: 1, path: '/dubai/al-barsha' },
  { nameEn: 'Motor City', nameAr: 'مدينة دبي للسيارات', level: 1, path: '/dubai/motor-city' }
];

// مناطق جديدة لأبوظبي
const newAbuDhabiAreas = [
  { nameEn: 'Al Reem Island', nameAr: 'جزيرة الريم', level: 1, path: '/abu-dhabi/al-reem' },
  { nameEn: 'Masdar City', nameAr: 'مدينة مصدر', level: 1, path: '/abu-dhabi/masdar' },
  { nameEn: 'Al Khalidiyah', nameAr: 'الخالدية', level: 1, path: '/abu-dhabi/al-khalidiyah' }
];

// مناطق جديدة للشارقة
const newSharjahAreas = [
  { nameEn: 'Al Majaz', nameAr: 'المجاز', level: 1, path: '/sharjah/al-majaz' },
  { nameEn: 'Al Qasba', nameAr: 'القصباء', level: 1, path: '/sharjah/al-qasba' },
  { nameEn: 'Muwailih', nameAr: 'مويلح', level: 1, path: '/sharjah/muwailih' }
];

// عقارات جديدة مع مميزات متنوعة
const newProperties = [
  // دبي هيلز
  { titleAr: 'فيلا 5 غرف في دبي هيلز', titleEn: '5BR Villa in Dubai Hills Estate', addressKey: 'Dubai Hills Estate', price: 4500000, type: 'villa', bedrooms: 5, bathrooms: 6, features: '{"amenities":["swimming_pool","gym","garden","maid_room"],"location":["golf_view","quiet_area"],"security":["gated_community","cctv"]}' },
  { titleAr: 'تاون هاوس 4 غرف في دبي هيلز', titleEn: '4BR Townhouse in Dubai Hills Estate', addressKey: 'Dubai Hills Estate', price: 3200000, type: 'townhouse', bedrooms: 4, bathrooms: 4, features: '{"amenities":["parking","garden","balcony"],"location":["near_school","park_view"],"security":["gated_community","security_guard"]}' },
  
  // المراعي العربية
  { titleAr: 'فيلا 4 غرف في المراعي العربية', titleEn: '4BR Villa in Arabian Ranches', addressKey: 'Arabian Ranches', price: 3800000, type: 'villa', bedrooms: 4, bathrooms: 5, features: '{"amenities":["swimming_pool","garden","storage_room","laundry_room"],"location":["golf_view","quiet_area"],"security":["gated_community","security_guard"]}' },
  
  // JBR
  { titleAr: 'شقة 3 غرف في جميرا بيتش ريزيدنس', titleEn: '3BR Apartment in JBR', addressKey: 'JBR - Jumeirah Beach Residence', price: 2800000, type: 'apartment', bedrooms: 3, bathrooms: 3, features: '{"amenities":["swimming_pool","gym","furnished"],"location":["sea_view","near_beach"],"security":["security_guard","access_card"]}' },
  { titleAr: 'بنتهاوس 4 غرف في JBR', titleEn: '4BR Penthouse in JBR', addressKey: 'JBR - Jumeirah Beach Residence', price: 5500000, type: 'penthouse', bedrooms: 4, bathrooms: 5, features: '{"amenities":["swimming_pool","gym","balcony","furnished"],"location":["sea_view","marina_view"],"security":["security_guard","cctv"]}' },
  
  // DIFC
  { titleAr: 'شقة 2 غرف في مركز دبي المالي', titleEn: '2BR Apartment in DIFC', addressKey: 'DIFC', price: 2200000, type: 'apartment', bedrooms: 2, bathrooms: 2, features: '{"amenities":["gym","furnished","air_conditioning"],"location":["central_location","near_metro"],"security":["security_system","access_card"]}' },
  
  // البرشاء
  { titleAr: 'فيلا 6 غرف في البرشاء', titleEn: '6BR Villa in Al Barsha', addressKey: 'Al Barsha', price: 4200000, type: 'villa', bedrooms: 6, bathrooms: 7, features: '{"amenities":["swimming_pool","garden","maid_room","study_room"],"location":["near_mall","near_school"],"security":["gated_community","cctv"]}' },
  
  // مدينة السيارات
  { titleAr: 'تاون هاوس 3 غرف في مدينة السيارات', titleEn: '3BR Townhouse in Motor City', addressKey: 'Motor City', price: 1800000, type: 'townhouse', bedrooms: 3, bathrooms: 3, features: '{"amenities":["parking","garden","storage_room"],"location":["quiet_area","near_mall"],"security":["gated_community","security_guard"]}' },
  
  // أبوظبي - جزيرة الريم
  { titleAr: 'شقة 3 غرف في جزيرة الريم', titleEn: '3BR Apartment in Al Reem Island', addressKey: 'Al Reem Island', price: 2400000, type: 'apartment', bedrooms: 3, bathrooms: 3, features: '{"amenities":["swimming_pool","gym","balcony"],"location":["sea_view","central_location"],"security":["security_guard","cctv"]}' },
  
  // مدينة مصدر
  { titleAr: 'فيلا 4 غرف في مدينة مصدر', titleEn: '4BR Villa in Masdar City', addressKey: 'Masdar City', price: 3500000, type: 'villa', bedrooms: 4, bathrooms: 5, features: '{"amenities":["garden","solar_panels","air_conditioning"],"location":["quiet_area","near_airport"],"security":["gated_community","security_system"]}' },
  
  // الشارقة - المجاز
  { titleAr: 'شقة 2 غرف في المجاز', titleEn: '2BR Apartment in Al Majaz', addressKey: 'Al Majaz', price: 850000, type: 'apartment', bedrooms: 2, bathrooms: 2, features: '{"amenities":["swimming_pool","gym","parking"],"location":["near_mall","city_view"],"security":["security_guard","intercom"]}' },
  
  // القصباء
  { titleAr: 'شقة 3 غرف في القصباء', titleEn: '3BR Apartment in Al Qasba', addressKey: 'Al Qasba', price: 1200000, type: 'apartment', bedrooms: 3, bathrooms: 2, features: '{"amenities":["balcony","air_conditioning","parking"],"location":["near_mall","central_location"],"security":["cctv","access_card"]}' },
  
  // مويلح
  { titleAr: 'فيلا 5 غرف في مويلح', titleEn: '5BR Villa in Muwailih', addressKey: 'Muwailih', price: 1800000, type: 'villa', bedrooms: 5, bathrooms: 6, features: '{"amenities":["garden","maid_room","storage_room"],"location":["quiet_area","near_school"],"security":["gated_community","security_guard"]}' }
];

async function addMoreProperties() {
  console.log('🏗️ إضافة مناطق وعقارات جديدة...\n');

  try {
    // جلب IDs الإمارات
    const emirates = await db.select().from(addresses).where(eq(addresses.level, 0));
    const dubaiId = emirates.find(e => e.nameEn === 'Dubai')?.id;
    const abuDhabiId = emirates.find(e => e.nameEn === 'Abu Dhabi')?.id;
    const sharjahId = emirates.find(e => e.nameEn === 'Sharjah')?.id;

    // إضافة المناطق الجديدة
    const allNewAreas = [
      ...newDubaiAreas.map(area => ({ ...area, parentId: dubaiId })),
      ...newAbuDhabiAreas.map(area => ({ ...area, parentId: abuDhabiId })),
      ...newSharjahAreas.map(area => ({ ...area, parentId: sharjahId }))
    ];

    for (const area of allNewAreas) {
      if (area.parentId) {
        await db.insert(addresses).values({
          nameEn: area.nameEn,
          nameAr: area.nameAr,
          parentId: area.parentId,
          level: area.level,
          path: area.path,
          isActive: true,
          displayOrder: 0
        });
        console.log(`📍 تم إضافة منطقة: ${area.nameAr}`);
      }
    }

    // جلب جميع العناوين المحدثة
    const allAddresses = await db.select().from(addresses);
    const addressMap = new Map();
    allAddresses.forEach(addr => {
      addressMap.set(addr.nameEn, addr.id);
    });

    // جلب الوكيل الافتراضي
    const defaultAgent = await db.select().from(agents).limit(1);
    const agentId = defaultAgent.length > 0 ? defaultAgent[0].id : null;

    // إضافة العقارات الجديدة
    let createdCount = 0;
    for (const prop of newProperties) {
      const addressId = addressMap.get(prop.addressKey);
      
      if (addressId) {
        await sqlClient`
          INSERT INTO properties (
            id, reference_number, title_en, title_ar, description_en, description_ar,
            location, address_id, area_name, city, price, currency, status, property_type,
            bedrooms, bathrooms, area_sqft, agent_id, images, features,
            is_featured, views_count, created_at, updated_at,
            completion_status, handover_status, payment_plans
          ) VALUES (
            gen_random_uuid(),
            ${`REF-${Date.now()}-${createdCount}`},
            ${prop.titleEn},
            ${prop.titleAr},
            ${'Premium property in excellent location'},
            ${`${prop.titleAr} في موقع مميز`},
            ${prop.addressKey},
            ${addressId},
            ${prop.addressKey},
            ${prop.addressKey.includes('Dubai') ? 'Dubai' : prop.addressKey.includes('Abu Dhabi') ? 'Abu Dhabi' : 'Sharjah'},
            ${prop.price},
            'AED',
            ${Math.random() > 0.5 ? 'sale' : 'rent'},
            ${prop.type},
            ${prop.bedrooms},
            ${prop.bathrooms},
            ${Math.floor(Math.random() * 3000) + 1000},
            ${agentId},
            '["https://via.placeholder.com/800x600"]',
            ${prop.features},
            ${Math.random() > 0.8},
            0,
            NOW(),
            NOW(),
            'completed',
            'ready',
            '[]'
          )
        `;

        console.log(`✅ تم إنشاء: ${prop.titleAr}`);
        createdCount++;
      }
    }

    console.log(`\n🎉 تم إضافة ${allNewAreas.length} منطقة جديدة و ${createdCount} عقار جديد!`);

  } catch (error) {
    console.error('❌ خطأ في الإضافة:', error);
  } finally {
    await sqlClient.end();
  }
}

addMoreProperties().catch(console.error);