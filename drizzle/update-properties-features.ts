import { db } from '../db';
import { properties } from '../shared/schema';
import { eq } from 'drizzle-orm';

const sampleFeatures = [
  {
    amenities: ['swimming_pool', 'gym', 'parking', 'garden', 'balcony'],
    location: ['near_mall', 'sea_view', 'near_metro'],
    security: ['security_guard', 'cctv', 'gated_community']
  },
  {
    amenities: ['elevator', 'air_conditioning', 'furnished', 'kitchen_appliances'],
    location: ['near_hospital', 'near_school', 'city_view'],
    security: ['access_card', 'intercom', 'fire_alarm']
  },
  {
    amenities: ['central_heating', 'laundry_room', 'storage_room', 'maid_room'],
    location: ['near_beach', 'park_view', 'quiet_area'],
    security: ['smoke_detector', 'emergency_exit', 'security_system']
  },
  {
    amenities: ['study_room', 'walk_in_closet', 'parking', 'garden'],
    location: ['golf_view', 'marina_view', 'central_location'],
    security: ['safe_deposit', 'cctv', 'gated_community']
  },
  {
    amenities: ['swimming_pool', 'gym', 'elevator', 'air_conditioning'],
    location: ['near_airport', 'near_mosque', 'sea_view'],
    security: ['security_guard', 'access_card', 'fire_alarm']
  }
];

async function updatePropertiesFeatures() {
  try {
    console.log('🔄 Updating properties with sample features...');
    
    // Get all properties
    const allProperties = await db.select().from(properties);
    
    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      const featuresIndex = i % sampleFeatures.length;
      const selectedFeatures = sampleFeatures[featuresIndex];
      
      await db.update(properties)
        .set({ 
          features: selectedFeatures,
          updatedAt: new Date()
        })
        .where(eq(properties.id, property.id));
      
      console.log(`✅ Updated property ${i + 1}/${allProperties.length}: ${property.titleEn}`);
    }
    
    console.log('✅ All properties updated with features successfully');
  } catch (error) {
    console.error('❌ Error updating properties features:', error);
  }
}

updatePropertiesFeatures();