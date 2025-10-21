import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { emirates, addresses } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

// UAE Hierarchical Addresses Data
const uaeAddressesData = [
  {
    nameEn: 'Dubai',
    nameAr: 'دبي',
    level: 0,
    path: '/dubai',
    children: [
      {
        nameEn: 'Dubai Marina',
        nameAr: 'دبي مارينا',
        level: 1,
        path: '/dubai/marina',
        children: [
          { nameEn: 'Marina Walk', nameAr: 'ممشى المارينا', level: 2, path: '/dubai/marina/walk' },
          { nameEn: 'JBR', nameAr: 'شاطئ جميرا', level: 2, path: '/dubai/marina/jbr' }
        ]
      },
      {
        nameEn: 'Downtown Dubai',
        nameAr: 'وسط مدينة دبي',
        level: 1,
        path: '/dubai/downtown',
        children: [
          { nameEn: 'Burj Khalifa Area', nameAr: 'منطقة برج خليفة', level: 2, path: '/dubai/downtown/burj-khalifa' },
          { nameEn: 'Dubai Mall Area', nameAr: 'منطقة دبي مول', level: 2, path: '/dubai/downtown/dubai-mall' }
        ]
      },
      {
        nameEn: 'Business Bay',
        nameAr: 'الخليج التجاري',
        level: 1,
        path: '/dubai/business-bay',
        children: [
          { nameEn: 'Canal Views', nameAr: 'إطلالات القناة', level: 2, path: '/dubai/business-bay/canal-views' }
        ]
      }
    ]
  },
  {
    nameEn: 'Abu Dhabi',
    nameAr: 'أبوظبي',
    level: 0,
    path: '/abu-dhabi',
    children: [
      {
        nameEn: 'Corniche Area',
        nameAr: 'منطقة الكورنيش',
        level: 1,
        path: '/abu-dhabi/corniche',
        children: [
          { nameEn: 'Corniche Beach', nameAr: 'شاطئ الكورنيش', level: 2, path: '/abu-dhabi/corniche/beach' }
        ]
      },
      {
        nameEn: 'Al Reem Island',
        nameAr: 'جزيرة الريم',
        level: 1,
        path: '/abu-dhabi/al-reem',
        children: [
          { nameEn: 'Shams Abu Dhabi', nameAr: 'شمس أبوظبي', level: 2, path: '/abu-dhabi/al-reem/shams' }
        ]
      }
    ]
  },
  {
    nameEn: 'Sharjah',
    nameAr: 'الشارقة',
    level: 0,
    path: '/sharjah',
    children: [
      {
        nameEn: 'Al Majaz',
        nameAr: 'الماجز',
        level: 1,
        path: '/sharjah/al-majaz',
        children: []
      }
    ]
  }
];

async function insertAddressHierarchy(addressData: any, parentId: string | null = null, displayOrder: number = 0) {
  // Insert current address
  const [insertedAddress] = await db.insert(addresses).values({
    nameEn: addressData.nameEn,
    nameAr: addressData.nameAr,
    parentId,
    level: addressData.level,
    path: addressData.path,
    isActive: true,
    displayOrder
  }).returning();

  console.log(`${'  '.repeat(addressData.level)}📍 Created: ${addressData.nameEn} (Level ${addressData.level})`);

  // Insert children recursively
  if (addressData.children && addressData.children.length > 0) {
    for (let i = 0; i < addressData.children.length; i++) {
      await insertAddressHierarchy(addressData.children[i], insertedAddress.id, i);
    }
  }

  return insertedAddress;
}

async function migrateHierarchicalAddresses() {
  console.log('🏗️ Starting hierarchical addresses migration...');

  try {
    // Insert all addresses hierarchically
    for (let i = 0; i < uaeAddressesData.length; i++) {
      await insertAddressHierarchy(uaeAddressesData[i], null, i);
    }

    console.log('✅ Hierarchical addresses migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run migration
migrateHierarchicalAddresses().catch(console.error);