import { execSync } from 'child_process';

console.log('🧪 اختبار API مباشر...\n');

try {
  // اختبار بدون فلاتر
  console.log('1️⃣ اختبار بدون فلاتر:');
  const result1 = execSync('curl -s "http://localhost:5000/api/v1/properties"', { encoding: 'utf8' });
  const data1 = JSON.parse(result1);
  console.log(`   النتيجة: ${data1.pagination?.total || 0} عقار`);
  
  if (data1.error) {
    console.log(`   خطأ: ${data1.error}`);
    console.log(`   التفاصيل: ${data1.details}`);
  }

  // اختبار مع فلتر مميزات
  console.log('\n2️⃣ اختبار مع فلتر swimming_pool:');
  const features = JSON.stringify({amenities: ['swimming_pool'], location: [], security: []});
  const result2 = execSync(`curl -s "http://localhost:5000/api/v1/properties?features=${encodeURIComponent(features)}"`, { encoding: 'utf8' });
  const data2 = JSON.parse(result2);
  console.log(`   النتيجة: ${data2.pagination?.total || 0} عقار`);
  
  if (data2.error) {
    console.log(`   خطأ: ${data2.error}`);
    console.log(`   التفاصيل: ${data2.details}`);
  }

} catch (error) {
  console.error('❌ خطأ:', error.message);
}