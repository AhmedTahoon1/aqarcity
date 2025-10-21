import { db } from '../db';
import { sql } from 'drizzle-orm';

async function updateFeaturesSchema() {
  try {
    console.log('🔄 Updating features schema...');
    
    // Update existing properties to have the new features structure
    await db.execute(sql`
      UPDATE properties 
      SET features = CASE 
        WHEN features IS NULL OR features::text = '[]' THEN 
          '{"amenities":[],"location":[],"security":[]}'::json
        WHEN jsonb_typeof(features::jsonb) = 'array' THEN 
          json_build_object(
            'amenities', features,
            'location', '[]'::json,
            'security', '[]'::json
          )
        ELSE features
      END
    `);
    
    console.log('✅ Features schema updated successfully');
  } catch (error) {
    console.error('❌ Error updating features schema:', error);
  }
}

updateFeaturesSchema();