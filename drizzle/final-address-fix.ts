import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties } from '../shared/schema.js';
import { eq, ilike } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function finalAddressFix() {
  console.log('🔧 الإصلاح النهائي للعناوين...\n');

  try {
    // 1. إنشاء عنوان JBR منفصل
    const jbrAddress = await db.insert(addresses).values({
      nameEn: 'JBR - Jumeirah Beach Residence',
      nameAr: 'جميرا بيتش ريزيدنس',
      parentId: 'a03fd081-59a8-49f9-9b85-58157c2e24dd',
      level: 1,
      path: '/dubai/jbr',
      isActive: true,
      displayOrder: 6
    }).returning();

    // 2. إنشاء عنوان جميرا منفصل
    const jumeirahAddress = await db.insert(addresses).values({
      nameEn: 'Jumeirah',
      nameAr: 'جميرا',
      parentId: 'a03fd081-59a8-49f9-9b85-58157c2e24dd',
      level: 1,
      path: '/dubai/jumeirah',
      isActive: true,
      displayOrder: 7
    }).returning();

    console.log('✅ تم إنشاء عناوين JBR وجميرا');

    // 3. إصلاح العقارات بشكل مباشر
    
    // شاطئ جميرا → JBR
    await db.update(properties)
      .set({ addressId: jbrAddress[0].id })
      .where(ilike(properties.location, 'شاطئ جميرا%'));
    console.log('✅ تم ربط شاطئ جميرا بـ JBR');

    // جميرا → جميرا الجديد
    await db.update(properties)
      .set({ addressId: jumeirahAddress[0].id })
      .where(ilike(properties.location, 'جميرا,%'));
    console.log('✅ تم ربط جميرا بالعنوان الجديد');

    // ديرة → جميرا الجديد
    await db.update(properties)
      .set({ addressId: jumeirahAddress[0].id })
      .where(ilike(properties.location, 'ديرة%'));
    console.log('✅ تم ربط ديرة بجميرا');

    console.log('\n🎉 تم الإصلاح النهائي بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error);
  } finally {
    await sqlClient.end();
  }
}

finalAddressFix().catch(console.error);