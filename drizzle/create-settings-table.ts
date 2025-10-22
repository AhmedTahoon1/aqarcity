import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function createTable() {
  try {
    console.log('🔄 Creating settings table...');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        key varchar(100) UNIQUE NOT NULL,
        value text,
        description text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key);
    `);

    console.log('✅ Settings table created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTable();
