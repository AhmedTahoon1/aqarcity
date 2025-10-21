import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties, agents } from '../shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function seedCleanProperties() {
  console.log('🌱 إنشاء عقارات نظيفة...\n');

  try {
    // حذف العقارات الموجودة
    await db.delete(properties);
    console.log('🗑️ تم حذف العقارات القديمة');

    // جلب العناوين
    const allAddresses = await db.select().from(addresses);
    const addressMap = new Map();
    allAddresses.forEach(addr => {
      addressMap.set(addr.nameEn, addr.id);
      addressMap.set(addr.nameAr, addr.id);
    });

    // جلب الوكيل الافتراضي
    const defaultAgent = await db.select().from(agents).limit(1);
    const agentId = defaultAgent.length > 0 ? defaultAgent[0].id : null;

    // العقارات النظيفة
    const cleanProperties = [
      // دبي - مارينا دبي
      { titleAr: 'شقة 2 غرف في مارينا دبي', titleEn: '2BR Apartment in Dubai Marina', addressKey: 'Dubai Marina', price: 1200000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
      { titleAr: 'بنتهاوس 3 غرف في مارينا دبي', titleEn: '3BR Penthouse in Dubai Marina', addressKey: 'Dubai Marina', price: 2500000, type: 'penthouse', bedrooms: 3, bathrooms: 3 },
      
      // دبي - وسط مدينة دبي
      { titleAr: 'شقة 2 غرف في وسط مدينة دبي', titleEn: '2BR Apartment in Downtown Dubai', addressKey: 'Downtown Dubai', price: 1800000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
      { titleAr: 'بنتهاوس 4 غرف في وسط مدينة دبي', titleEn: '4BR Penthouse in Downtown Dubai', addressKey: 'Downtown Dubai', price: 4500000, type: 'penthouse', bedrooms: 4, bathrooms: 4 },
      
      // دبي - نخلة جميرا
      { titleAr: 'فيلا 4 غرف في نخلة جميرا', titleEn: '4BR Villa in Palm Jumeirah', addressKey: 'Palm Jumeirah', price: 6000000, type: 'villa', bedrooms: 4, bathrooms: 5 },
      
      // دبي - الخليج التجاري
      { titleAr: 'شقة 2 غرف في الخليج التجاري', titleEn: '2BR Apartment in Business Bay', addressKey: 'Business Bay', price: 1400000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
      
      // دبي - جميرا
      { titleAr: 'فيلا 5 غرف في جميرا', titleEn: '5BR Villa in Jumeirah', addressKey: 'Jumeirah', price: 8000000, type: 'villa', bedrooms: 5, bathrooms: 6 },
      
      // أبوظبي - جزيرة السعديات
      { titleAr: 'شقة 2 غرف في جزيرة السعديات', titleEn: '2BR Apartment in Saadiyat Island', addressKey: 'Saadiyat Island', price: 1600000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
      
      // أبوظبي - جزيرة ياس
      { titleAr: 'شقة 3 غرف في جزيرة ياس', titleEn: '3BR Apartment in Yas Island', addressKey: 'Yas Island', price: 2200000, type: 'apartment', bedrooms: 3, bathrooms: 3 },
      
      // الشارقة - النهدة
      { titleAr: 'شقة 2 غرف في النهدة', titleEn: '2BR Apartment in Al Nahda', addressKey: 'Al Nahda', price: 650000, type: 'apartment', bedrooms: 2, bathrooms: 2 },
      
      // عجمان
      { titleAr: 'شقة 1 غرفة في عجمان', titleEn: '1BR Apartment in Ajman', addressKey: 'Ajman', price: 350000, type: 'apartment', bedrooms: 1, bathrooms: 1 },
    ];

    let createdCount = 0;
    for (const prop of cleanProperties) {
      const addressId = addressMap.get(prop.addressKey);
      
      if (addressId) {
        // استخدام SQL مباشر لتجنب مشكلة الحقول المفقودة
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
            ${'Beautiful property in prime location'},
            ${`${prop.titleAr} في موقع مميز`},
            ${prop.titleEn.split(' in ')[1] || prop.addressKey},
            ${addressId},
            ${prop.addressKey},
            ${prop.addressKey.includes('Dubai') ? 'Dubai' : prop.addressKey.includes('Abu Dhabi') ? 'Abu Dhabi' : prop.addressKey.includes('Sharjah') ? 'Sharjah' : 'Ajman'},
            ${prop.price},
            'AED',
            ${Math.random() > 0.5 ? 'sale' : 'rent'},
            ${prop.type},
            ${prop.bedrooms},
            ${prop.bathrooms},
            ${Math.floor(Math.random() * 2000) + 800},
            ${agentId},
            '["https://via.placeholder.com/800x600"]',
            '{"amenities":["swimming_pool","gym","parking"],"location":["near_metro"],"security":["cctv"]}',
            false,
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

    console.log(`\n🎉 تم إنشاء ${createdCount} عقار نظيف!`);

  } catch (error) {
    console.error('❌ خطأ في الإنشاء:', error);
  } finally {
    await sqlClient.end();
  }
}

seedCleanProperties().catch(console.error);