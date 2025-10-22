import { execSync } from 'child_process';

console.log('🔍 فحص حالة الخادم...\n');

try {
  // فحص المنفذ 5000
  const result = execSync('netstat -an | findstr :5000', { encoding: 'utf8' });
  if (result.includes('LISTENING')) {
    console.log('✅ الخادم يعمل على المنفذ 5000');
    
    // اختبار API
    try {
      const apiTest = execSync('curl -s http://localhost:5000/api/v1/properties?limit=1', { encoding: 'utf8' });
      const data = JSON.parse(apiTest);
      console.log(`✅ API يعمل - ${data.pagination?.total || 0} عقار`);
    } catch (apiError) {
      console.log('❌ API لا يستجيب');
      console.log('💡 تأكد من تشغيل: npm run dev:server');
    }
  } else {
    console.log('❌ الخادم لا يعمل على المنفذ 5000');
    console.log('💡 قم بتشغيل: npm run dev:server');
  }
} catch (error) {
  console.log('❌ الخادم لا يعمل');
  console.log('💡 قم بتشغيل: npm run dev:server');
}