import { db } from '../db';
import { properties } from '../shared/schema';

async function checkProperties() {
  try {
    console.log('🔍 Checking properties in database...');
    
    const allProperties = await db.select().from(properties);
    
    console.log(`📊 Total properties found: ${allProperties.length}`);
    
    if (allProperties.length > 0) {
      console.log('\n📋 Sample properties:');
      allProperties.slice(0, 3).forEach((property, index) => {
        console.log(`${index + 1}. ${property.titleEn} - ${property.city} - ${property.price} ${property.currency}`);
        console.log(`   Features: ${JSON.stringify(property.features)}`);
      });
    } else {
      console.log('❌ No properties found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking properties:', error);
  }
}

checkProperties();