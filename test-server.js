// اختبار بسيط للخادم
console.log('🧪 اختبار الخادم...');

fetch('http://localhost:5000/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ الخادم يعمل:', data);
    
    // اختبار endpoint البحوثات
    return fetch('http://localhost:5000/api/v1/guest-searches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactType: 'whatsapp',
        contactValue: '+971501234567',
        name: 'اختبار البحث',
        searchCriteria: { test: true }
      })
    });
  })
  .then(response => {
    console.log('📡 استجابة API:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📋 بيانات الاستجابة:', data);
  })
  .catch(error => {
    console.error('❌ خطأ:', error.message);
    console.log('💡 تأكد من تشغيل الخادم: npm run dev:server');
  });