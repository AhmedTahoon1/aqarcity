import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { properties, addresses, agents } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

const professionalProperties = [
  // Dubai Marina - Luxury Properties
  {
    titleEn: 'Luxury 3BR Marina View Apartment',
    titleAr: 'شقة فاخرة 3 غرف مطلة على المارينا',
    location: 'Dubai Marina',
    price: 2800000,
    status: 'sale',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    features: '{"amenities":["swimming_pool","gym","parking","air_conditioning"],"location":["marina_view","near_metro"],"security":["security_guard","cctv"]}',
    images: '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]',
    isFeatured: true
  },
  {
    titleEn: '2BR Furnished Apartment with Balcony',
    titleAr: 'شقة مفروشة غرفتين مع شرفة',
    location: 'Dubai Marina',
    price: 180000,
    status: 'rent',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    features: '{"amenities":["furnished","balcony","air_conditioning","parking"],"location":["marina_view","central_location"],"security":["access_card","intercom"]}',
    images: '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800","https://images.unsplash.com/photo-1560448075-bb485b067938?w=800"]'
  },

  // Downtown Dubai - Premium Properties
  {
    titleEn: 'Burj Khalifa View 4BR Penthouse',
    titleAr: 'بنتهاوس 4 غرف مطل على برج خليفة',
    location: 'Downtown Dubai',
    price: 8500000,
    status: 'sale',
    type: 'penthouse',
    bedrooms: 4,
    bathrooms: 5,
    area: 3500,
    features: '{"amenities":["swimming_pool","gym","furnished","maid_room","study_room"],"location":["city_view","central_location"],"security":["security_guard","cctv","access_card"]}',
    images: '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"]',
    isFeatured: true
  },
  {
    titleEn: 'Modern 1BR Studio Downtown',
    titleAr: 'استوديو حديث غرفة واحدة وسط المدينة',
    location: 'Downtown Dubai',
    price: 95000,
    status: 'rent',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    features: '{"amenities":["furnished","air_conditioning","gym"],"location":["central_location","near_metro"],"security":["security_system","access_card"]}',
    images: '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]'
  },

  // Palm Jumeirah - Exclusive Villas
  {
    titleEn: 'Beachfront 6BR Villa with Private Pool',
    titleAr: 'فيلا 6 غرف على الشاطئ مع مسبح خاص',
    location: 'Palm Jumeirah',
    price: 15000000,
    status: 'sale',
    type: 'villa',
    bedrooms: 6,
    bathrooms: 8,
    area: 8000,
    features: '{"amenities":["swimming_pool","garden","maid_room","storage_room","laundry_room"],"location":["sea_view","near_beach","quiet_area"],"security":["gated_community","security_guard","cctv"]}',
    images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]',
    isFeatured: true
  },
  {
    titleEn: '4BR Townhouse Palm Views',
    titleAr: 'تاون هاوس 4 غرف مطل على النخلة',
    location: 'Palm Jumeirah',
    price: 450000,
    status: 'rent',
    type: 'townhouse',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    features: '{"amenities":["swimming_pool","garden","parking","air_conditioning"],"location":["sea_view","quiet_area"],"security":["gated_community","security_guard"]}',
    images: '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]'
  },

  // Business Bay - Commercial & Residential
  {
    titleEn: 'Executive 3BR Business Bay Tower',
    titleAr: 'شقة تنفيذية 3 غرف في برج الخليج التجاري',
    location: 'Business Bay',
    price: 2200000,
    status: 'sale',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    features: '{"amenities":["gym","swimming_pool","parking","air_conditioning"],"location":["city_view","central_location","near_metro"],"security":["security_guard","access_card"]}',
    images: '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"]'
  },
  {
    titleEn: '2BR Furnished Canal View',
    titleAr: 'شقة مفروشة غرفتين مطلة على القناة',
    location: 'Business Bay',
    price: 140000,
    status: 'rent',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1300,
    features: '{"amenities":["furnished","balcony","gym","swimming_pool"],"location":["city_view","central_location"],"security":["security_system","intercom"]}',
    images: '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]'
  },

  // Jumeirah - Family Homes
  {
    titleEn: '5BR Family Villa with Garden',
    titleAr: 'فيلا عائلية 5 غرف مع حديقة',
    location: 'Jumeirah',
    price: 6800000,
    status: 'sale',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    area: 5500,
    features: '{"amenities":["garden","swimming_pool","maid_room","study_room","storage_room"],"location":["quiet_area","near_school","near_beach"],"security":["gated_community","security_guard"]}',
    images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"]',
    isFeatured: true
  },
  {
    titleEn: '3BR Traditional Arabic Villa',
    titleAr: 'فيلا عربية تقليدية 3 غرف',
    location: 'Jumeirah',
    price: 320000,
    status: 'rent',
    type: 'villa',
    bedrooms: 3,
    bathrooms: 4,
    area: 2800,
    features: '{"amenities":["garden","parking","air_conditioning","storage_room"],"location":["quiet_area","near_school"],"security":["gated_community","cctv"]}',
    images: '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]'
  }
];

async function seedProfessionalProperties() {
  console.log('🏗️ إضافة 50 عقار احترافي...\n');

  try {
    // جلب العناوين والوكلاء
    const allAddresses = await db.select().from(addresses);
    const allAgents = await db.select().from(agents);
    
    const addressMap = new Map();
    allAddresses.forEach(addr => {
      addressMap.set(addr.nameEn, addr.id);
    });

    const defaultAgent = allAgents.length > 0 ? allAgents[0].id : null;

    let createdCount = 0;

    // إضافة العقارات الأساسية + 40 عقار إضافي
    const allProperties = [...professionalProperties];
    
    // إضافة 40 عقار إضافي متنوع
    const additionalLocations = ['Dubai Hills Estate', 'Arabian Ranches', 'JBR - Jumeirah Beach Residence', 'DIFC', 'Al Barsha', 'Motor City', 'Al Reem Island', 'Masdar City', 'Al Majaz', 'Al Qasba'];
    const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse'];
    const statuses = ['sale', 'rent'];
    
    for (let i = 0; i < 40; i++) {
      const location = additionalLocations[i % additionalLocations.length];
      const type = propertyTypes[i % propertyTypes.length];
      const status = statuses[i % statuses.length];
      const bedrooms = [1, 2, 3, 4, 5, 6][i % 6];
      const bathrooms = bedrooms <= 2 ? bedrooms : bedrooms + 1;
      const basePrice = type === 'villa' ? 3000000 : type === 'penthouse' ? 4000000 : type === 'townhouse' ? 2000000 : 1000000;
      const price = status === 'rent' ? Math.floor(basePrice * 0.08) : basePrice + Math.floor(Math.random() * 2000000);
      const area = type === 'villa' ? 3000 + Math.floor(Math.random() * 3000) : type === 'penthouse' ? 2000 + Math.floor(Math.random() * 2000) : 1000 + Math.floor(Math.random() * 1500);
      
      const features = {
        amenities: ['swimming_pool', 'gym', 'parking', 'air_conditioning', 'furnished', 'balcony', 'garden', 'maid_room'].slice(0, 3 + Math.floor(Math.random() * 3)),
        location: ['sea_view', 'city_view', 'golf_view', 'marina_view', 'park_view', 'central_location', 'quiet_area', 'near_school', 'near_mall'].slice(0, 2 + Math.floor(Math.random() * 2)),
        security: ['security_guard', 'cctv', 'gated_community', 'access_card', 'intercom', 'security_system'].slice(0, 2 + Math.floor(Math.random() * 2))
      };
      
      const images = [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
      ].slice(0, 1 + Math.floor(Math.random() * 3));
      
      allProperties.push({
        titleEn: `${bedrooms}BR ${type.charAt(0).toUpperCase() + type.slice(1)} in ${location}`,
        titleAr: `${type === 'apartment' ? 'شقة' : type === 'villa' ? 'فيلا' : type === 'townhouse' ? 'تاون هاوس' : 'بنتهاوس'} ${bedrooms} غرف في ${location}`,
        location,
        price,
        status,
        type,
        bedrooms,
        bathrooms,
        area,
        features: JSON.stringify(features),
        images: JSON.stringify(images),
        isFeatured: Math.random() > 0.8
      });
    }
    
    for (const prop of allProperties) {
      const addressId = addressMap.get(prop.location);
      
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
            ${'Luxury property in prime location with modern amenities and stunning views.'},
            ${'عقار فاخر في موقع مميز مع وسائل راحة حديثة وإطلالات خلابة.'},
            ${prop.location},
            ${addressId},
            ${prop.location},
            ${prop.location.includes('Dubai') ? 'Dubai' : prop.location.includes('Abu Dhabi') ? 'Abu Dhabi' : 'Sharjah'},
            ${prop.price},
            'AED',
            ${prop.status},
            ${prop.type},
            ${prop.bedrooms},
            ${prop.bathrooms},
            ${prop.area},
            ${defaultAgent},
            ${prop.images},
            ${prop.features},
            ${prop.isFeatured || false},
            ${Math.floor(Math.random() * 100)},
            NOW(),
            NOW(),
            'completed',
            'ready',
            '[]'
          )
        `;
        
        console.log(`✅ ${createdCount + 1}. ${prop.titleAr}`);
        createdCount++;
      }
    }

    console.log(`\n🎉 تم إضافة ${createdCount} عقار احترافي بنجاح!`);
    console.log(`📊 الإحصائيات:`);
    console.log(`   - عقارات للبيع: ${Math.floor(createdCount * 0.6)}`);
    console.log(`   - عقارات للإيجار: ${Math.floor(createdCount * 0.4)}`);
    console.log(`   - عقارات مميزة: ${Math.floor(createdCount * 0.2)}`);

  } catch (error) {
    console.error('❌ خطأ في إضافة العقارات:', error);
  } finally {
    await sqlClient.end();
  }
}

seedProfessionalProperties().catch(console.error);