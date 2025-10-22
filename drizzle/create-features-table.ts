import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function createFeaturesTable() {
  console.log('🏗️ إنشاء جدول المميزات...\n');

  try {
    // إنشاء الجدول مباشرة
    await sqlClient`
      CREATE TABLE IF NOT EXISTS "property_features" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name_en" varchar(100) NOT NULL,
        "name_ar" varchar(100) NOT NULL,
        "category" varchar(20) NOT NULL,
        "parent_id" uuid,
        "level" integer DEFAULT 1 NOT NULL,
        "display_order" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;

    // إنشاء الفهارس
    await sqlClient`CREATE INDEX IF NOT EXISTS "property_features_category_idx" ON "property_features" ("category");`;
    await sqlClient`CREATE INDEX IF NOT EXISTS "property_features_parent_idx" ON "property_features" ("parent_id");`;
    await sqlClient`CREATE INDEX IF NOT EXISTS "property_features_active_idx" ON "property_features" ("is_active");`;

    // إضافة foreign key constraint
    await sqlClient`
      DO $$ BEGIN
        ALTER TABLE "property_features" ADD CONSTRAINT "property_features_parent_id_property_features_id_fk" 
        FOREIGN KEY ("parent_id") REFERENCES "property_features"("id") ON DELETE no action ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    console.log('✅ تم إنشاء جدول المميزات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إنشاء الجدول:', error);
  } finally {
    await sqlClient.end();
  }
}

createFeaturesTable().catch(console.error);