import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function createTable() {
  try {
    console.log('🔄 Creating social_media_links table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS social_media_links (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        facebook text,
        instagram text,
        x text,
        snapchat text,
        linkedin text,
        tiktok text,
        youtube text,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('✅ Table created successfully');

    // Insert initial empty row
    await db.execute(sql`
      INSERT INTO social_media_links (facebook, instagram, x, snapchat, linkedin, tiktok, youtube)
      SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL
      WHERE NOT EXISTS (SELECT 1 FROM social_media_links LIMIT 1);
    `);

    console.log('✅ Initial row inserted');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTable();
