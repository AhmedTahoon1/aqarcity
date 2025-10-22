import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { properties, favorites, inquiries } from '../shared/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function deleteAllProperties() {
  console.log('🗑️ حذف جميع العقارات...\n');

  try {
    // حذف المفضلة المرتبطة بالعقارات
    const deletedFavorites = await db.delete(favorites);
    console.log('✅ تم حذف جميع المفضلة');

    // حذف الاستفسارات المرتبطة بالعقارات
    const deletedInquiries = await db.delete(inquiries);
    console.log('✅ تم حذف جميع الاستفسارات');

    // حذف جميع العقارات
    const deletedProperties = await db.delete(properties);
    console.log('✅ تم حذف جميع العقارات');

    console.log('\n🎉 تم حذف جميع العقارات والبيانات المرتبطة بها بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في حذف العقارات:', error);
  } finally {
    await sqlClient.end();
  }
}

deleteAllProperties().catch(console.error);