import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { addresses, properties } from '../shared/schema.js';
import { eq, ilike } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function fixRemainingAddresses() {
  console.log('🔧 إصلاح العناوين المتبقية...\n');

  try {
    // إنشاء عنوان جميرا منفصل عن نخلة جميرا
    const jumeirahAddress = await db.insert(addresses).values({
      nameEn: 'Jumeirah',
      nameAr: 'جميرا',
      parentId: 'a03fd081-59a8-49f9-9b85-58157c2e24dd', // دبي
      level: 1,
      path: '/dubai/jumeirah',
      isActive: true,
      displayOrder: 5
    }).returning();

    console.log('✅ تم إنشاء عنوان جميرا منفصل');

    // إصلاح العقارات
    const fixes = [
      {
        locationPattern: 'شاطئ جميرا',
        targetAddress: 'JBR - Jumeirah Beach Residence',
        description: 'شاطئ جميرا → JBR'
      },
      {
        locationPattern: 'جميرا',
        targetAddress: 'Jumeirah',
        description: 'جميرا → جميرا (منفصل)'
      },
      {
        locationPattern: 'ديرة',
        targetAddress: 'Jumeirah',
        description: 'ديرة → جميرا'
      }
    ];

    for (const fix of fixes) {
      // البحث عن العنوان الصحيح
      const correctAddress = await db.select()
        .from(addresses)
        .where(ilike(addresses.nameEn, `%${fix.targetAddress}%`))
        .limit(1);

      if (correctAddress.length > 0) {
        // البحث عن العقارات التي تحتاج إصلاح
        const propertiesNeedFix = await db.select()
          .from(properties)
          .where(ilike(properties.location, `${fix.locationPattern}%`));

        // تحديث العقارات
        for (const prop of propertiesNeedFix) {
          await db.update(properties)
            .set({ addressId: correctAddress[0].id })
            .where(eq(properties.id, prop.id));
        }

        console.log(`✅ ${fix.description}: ${propertiesNeedFix.length} عقار`);
      }
    }

    console.log('\n🎉 تم إصلاح العناوين المتبقية');

  } catch (error) {
    console.error('❌ خطأ في الإصلاح:', error);
  } finally {
    await sqlClient.end();
  }
}

fixRemainingAddresses().catch(console.error);