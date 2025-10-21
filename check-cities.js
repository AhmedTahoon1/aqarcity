import { db } from './db.ts';
import { properties } from './shared/schema.ts';
import { sql } from 'drizzle-orm';

async function checkCities() {
  try {
    console.log('🔍 Checking cities in database...');
    
    // Get unique cities
    const cities = await db.select({
      city: properties.city,
      count: sql`count(*)`
    })
    .from(properties)
    .groupBy(properties.city)
    .orderBy(sql`count(*) desc`);
    
    console.log('\n📊 Cities in database:');
    cities.forEach(city => {
      console.log(`- ${city.city}: ${city.count} properties`);
    });
    
    // Test city filter
    console.log('\n🧪 Testing city filter for "Dubai"...');
    const dubaiProperties = await db.select()
      .from(properties)
      .where(sql`${properties.city} ILIKE '%Dubai%'`)
      .limit(3);
    
    console.log(`Found ${dubaiProperties.length} properties with Dubai filter`);
    dubaiProperties.forEach(prop => {
      console.log(`- ${prop.titleEn} in ${prop.city}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCities();