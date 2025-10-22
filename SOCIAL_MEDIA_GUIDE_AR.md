# دليل استخدام ميزة وسائل التواصل الاجتماعي

## كيفية الوصول للفورم

### الطريقة الأولى: من صفحة الإعدادات
1. سجل دخول كـ **Admin** أو **Super Admin**
2. اذهب إلى: `/settings`
3. ستجد قسم "روابط وسائل التواصل الاجتماعي" في الأسفل

### الطريقة الثانية: صفحة مخصصة (جديد)
1. سجل دخول كـ **Admin** أو **Super Admin**
2. اذهب مباشرة إلى: `/admin/social-media`
3. ستجد الفورم كامل

## كيفية إضافة الروابط

1. افتح الفورم من أحد الطريقتين أعلاه
2. أضف روابط المنصات التي تريدها:
   - Facebook: `https://facebook.com/aqarcity`
   - Instagram: `https://instagram.com/aqarcity`
   - X (Twitter): `https://x.com/aqarcity`
   - Snapchat: `https://snapchat.com/add/aqarcity`
   - LinkedIn: `https://linkedin.com/company/aqarcity`
   - TikTok: `https://tiktok.com/@aqarcity`
   - YouTube: `https://youtube.com/@aqarcity`
3. اضغط "حفظ التغييرات"

## لماذا لا تظهر الأيقونات في الفوتر؟

الأيقونات تظهر **فقط** للمنصات التي أضفت لها روابط:
- ✅ إذا أضفت رابط Facebook → تظهر أيقونة Facebook
- ❌ إذا تركت الحقل فارغ → لا تظهر الأيقونة

**مثال:**
- أضفت روابط لـ: Facebook, Instagram, YouTube
- النتيجة: تظهر 3 أيقونات فقط في الفوتر

## اختبار سريع

### 1. تحقق من الـ API
افتح المتصفح واذهب إلى:
```
http://localhost:5000/api/v1/social-media
```

يجب أن ترى:
```json
{
  "id": "...",
  "facebook": null,
  "instagram": null,
  "x": null,
  ...
}
```

### 2. أضف رابط تجريبي
1. اذهب إلى `/admin/social-media`
2. أضف رابط Facebook: `https://facebook.com/test`
3. احفظ
4. افتح الصفحة الرئيسية
5. انزل للفوتر → يجب أن تظهر أيقونة Facebook

## حل المشاكل

### المشكلة: لا أرى الفورم في Settings
**الحل:** تأكد أنك مسجل دخول كـ Admin أو Super Admin

### المشكلة: الأيقونات لا تظهر في الفوتر
**الحل:** 
1. تأكد أنك أضفت روابط وحفظتها
2. حدث الصفحة (F5)
3. افتح Console في المتصفح وتحقق من الأخطاء

### المشكلة: خطأ عند الحفظ
**الحل:**
1. تأكد أن السيرفر يعمل
2. تأكد أن الجدول موجود في قاعدة البيانات
3. شغل: `npm run db:create-social-media`

## الروابط المهمة

- **صفحة الإعدادات:** http://localhost:5173/settings
- **صفحة السوشيال ميديا:** http://localhost:5173/admin/social-media
- **API Endpoint:** http://localhost:5000/api/v1/social-media

## ملاحظات

- الأيقونات تفتح في تاب جديد
- الروابط اختيارية (يمكنك ترك أي حقل فارغ)
- التحديثات تظهر فوراً في الفوتر
- الميزة تدعم العربية والإنجليزية
