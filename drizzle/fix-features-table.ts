import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function fixFeaturesTable() {
  console.log('🔧 إصلاح جدول المميزات...\n');

  try {
    // إضافة العمود المفقود
    await sqlClient`ALTER TABLE property_features ADD COLUMN IF NOT EXISTS parent_id uuid;`;
    
    // إضافة الفهرس
    await sqlClient`CREATE INDEX IF NOT EXISTS "property_features_parent_idx" ON "property_features" ("parent_id");`;
    
    // إضافة foreign key constraint
    await sqlClient`
      DO $$ BEGIN
        ALTER TABLE "property_features" ADD CONSTRAINT "property_features_parent_id_property_features_id_fk" 
        FOREIGN KEY ("parent_id") REFERENCES "property_features"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log('✅ تم إصلاح جدول المميزات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error);
  } finally {
    await sqlClient.end();
  }
}

fixFeaturesTable().catch(console.error);