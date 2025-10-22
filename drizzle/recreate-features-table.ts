import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function recreateFeaturesTable() {
  console.log('🔄 إعادة إنشاء جدول المميزات...\n');

  try {
    // حذف الجدول القديم
    await sqlClient`DROP TABLE IF EXISTS property_features CASCADE;`;
    console.log('🗑️ تم حذف الجدول القديم');

    // إنشاء الجدول الجديد
    await sqlClient`
      CREATE TABLE "property_features" (
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
    console.log('🏗️ تم إنشاء الجدول الجديد');

    // إنشاء الفهارس
    await sqlClient`CREATE INDEX "property_features_category_idx" ON "property_features" ("category");`;
    await sqlClient`CREATE INDEX "property_features_parent_idx" ON "property_features" ("parent_id");`;
    await sqlClient`CREATE INDEX "property_features_active_idx" ON "property_features" ("is_active");`;
    console.log('📊 تم إنشاء الفهارس');

    // إضافة foreign key constraint
    await sqlClient`
      ALTER TABLE "property_features" ADD CONSTRAINT "property_features_parent_id_property_features_id_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "property_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;
    console.log('🔗 تم إضافة العلاقات');

    console.log('✅ تم إعادة إنشاء جدول المميزات بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في إعادة الإنشاء:', error);
  } finally {
    await sqlClient.end();
  }
}

recreateFeaturesTable().catch(console.error);