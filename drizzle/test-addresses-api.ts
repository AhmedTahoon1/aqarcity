import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

async function testAddressesAPI() {
  console.log('🧪 اختبار API العناوين...\n');

  try {
    // اختبار API العناوين
    const response = await fetch('http://localhost:5000/api/v1/addresses/flat?withStats=true');
    const data = await response.json();

    console.log('📊 نتائج API:');
    console.log(`عدد العناوين المعروضة: ${data.length}`);
    
    data.forEach(addr => {
      console.log(`- ${addr.nameAr} (${addr.nameEn}) - المستوى: ${addr.level} - العقارات: ${addr.propertyCount || 0}`);
    });

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await sqlClient.end();
  }
}

testAddressesAPI().catch(console.error);