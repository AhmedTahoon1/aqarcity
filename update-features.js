#!/usr/bin/env node

/**
 * تحديث المميزات في قاعدة البيانات لتتطابق مع الفلاتر
 * Update features in database to match filters
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔄 تحديث نظام المميزات...\n');

try {
  // تشغيل ملف seed-features.ts
  console.log('📝 تحديث المميزات في قاعدة البيانات...');
  execSync('npx tsx drizzle/seed-features.ts', { 
    stdio: 'inherit',
    cwd: __dirname 
  });

  console.log('\n✅ تم تحديث نظام المميزات بنجاح!');
  console.log('\n📋 ما تم تحديثه:');
  console.log('   • توحيد معرفات المميزات بين قاعدة البيانات والفلاتر');
  console.log('   • إضافة المميزات المفقودة (Elevator, Central Heating, Kitchen Appliances, إلخ)');
  console.log('   • تحديث API المميزات لاستخدام معرفات متسقة');
  console.log('   • تحديث الملفات الثابتة لتتطابق مع قاعدة البيانات');
  
  console.log('\n🎯 النتيجة:');
  console.log('   • المميزات في العقارات والفلاتر تعمل الآن بشكل متطابق');
  console.log('   • يمكن البحث والفلترة بالمميزات بشكل صحيح');
  console.log('   • عرض المميزات موحد في جميع أنحاء التطبيق');

} catch (error) {
  console.error('\n❌ خطأ في تحديث المميزات:', error.message);
  process.exit(1);
}