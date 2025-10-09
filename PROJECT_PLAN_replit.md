# 📋 المخطط الشامل لمنصة Aqar City UAE

## 🎯 نظرة عامة على المشروع

**منصة عقارية ديناميكية 100% لسوق الإمارات** تتضمن:
- PWA قابل للتثبيت والعمل بدون إنترنت
- دعم كامل للعربية والإنجليزية (RTL/LTR)
- بوت محادثة ذكي مع OpenAI
- تكامل WhatsApp للتواصل الفوري
- نظام إدارة شامل متعدد الصلاحيات

---

## 🏗️ البنية التقنية

### **Frontend Stack**
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + Shadcn UI
- 🌐 Wouter (Routing)
- 🔄 TanStack Query (State Management)
- 🌍 i18next (Bilingual Support)
- 📱 PWA (Service Workers + Manifest)
- 🗺️ Google Maps API
- 💬 Socket.io-client (Real-time)

### **Backend Stack**
- 🚀 Node.js + Express.js
- 🗄️ PostgreSQL + Drizzle ORM
- 🔐 Replit Auth (OAuth: Google, Apple, GitHub)
- 🤖 OpenAI API (AI Chatbot)
- 📱 Twilio API (WhatsApp Business)
- 📊 Socket.io (Real-time messaging)
- 📧 Nodemailer (Email notifications)
- 🖼️ Cloudinary/AWS S3 (Image storage)

---

## 📊 قاعدة البيانات - النماذج الأساسية

### **1. Users (المستخدمين)**
```typescript
{
  id: uuid (PK)
  email: string (unique)
  name: string
  phone: string
  avatar: string (url)
  role: 'buyer' | 'agent' | 'admin' | 'super_admin'
  language_preference: 'ar' | 'en'
  created_at: timestamp
  updated_at: timestamp
}
```

### **2. Properties (العقارات)**
```typescript
{
  id: uuid (PK)
  title_en: string
  title_ar: string
  description_en: text
  description_ar: text
  location: string
  city: string
  area_name: string
  coordinates: { lat: number, lng: number }
  price: decimal
  currency: 'AED' | 'USD'
  status: 'sale' | 'rent'
  property_type: 'villa' | 'apartment' | 'townhouse' | 'penthouse' | 'land'
  bedrooms: integer
  bathrooms: integer
  area_sqft: integer
  year_built: integer
  features: json[] // ['pool', 'garden', 'parking', etc.]
  images: string[] // URLs
  agent_id: uuid (FK)
  developer_id: uuid (FK)
  is_featured: boolean
  views_count: integer
  created_at: timestamp
  updated_at: timestamp
}
```

### **3. Agents (الوكلاء)**
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK)
  bio_en: text
  bio_ar: text
  license_number: string
  verified: boolean
  rating: decimal (0-5)
  languages: string[] // ['English', 'Arabic', 'French']
  properties_count: integer
  deals_closed: integer
  phone: string
  whatsapp: string
  email: string
  created_at: timestamp
}
```

### **4. Developers (المطورين)**
```typescript
{
  id: uuid (PK)
  name_en: string
  name_ar: string
  logo: string (url)
  description_en: text
  description_ar: text
  projects_count: integer
  website: string
  created_at: timestamp
}
```

### **5. Favorites (المفضلة)**
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK)
  property_id: uuid (FK)
  created_at: timestamp
}
```

### **6. Inquiries (الاستفسارات)**
```typescript
{
  id: uuid (PK)
  property_id: uuid (FK)
  user_id: uuid (FK)
  name: string
  email: string
  phone: string
  message: text
  status: 'new' | 'contacted' | 'closed'
  created_at: timestamp
}
```

### **7. Chat_Messages (رسائل المحادثة)**
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK)
  agent_id: uuid (FK, nullable)
  property_id: uuid (FK, nullable)
  message: text
  sender_type: 'user' | 'bot' | 'agent'
  is_read: boolean
  created_at: timestamp
}
```

### **8. Reviews (التقييمات)**
```typescript
{
  id: uuid (PK)
  agent_id: uuid (FK)
  user_id: uuid (FK)
  rating: integer (1-5)
  comment: text
  created_at: timestamp
}
```

### **9. Blog_Posts (المدونة)**
```typescript
{
  id: uuid (PK)
  title_en: string
  title_ar: string
  content_en: text
  content_ar: text
  slug: string (unique)
  category: string
  tags: string[]
  author_id: uuid (FK)
  featured_image: string (url)
  published_at: timestamp
  created_at: timestamp
}
```

### **10. Notifications (الإشعارات)**
```typescript
{
  id: uuid (PK)
  user_id: uuid (FK)
  type: 'new_property' | 'price_change' | 'inquiry_response' | 'message'
  title: string
  message: text
  property_id: uuid (FK, nullable)
  is_read: boolean
  created_at: timestamp
}
```

---

## 🎨 الواجهة الأمامية - الصفحات والمكونات

### **الصفحات الرئيسية**

#### **1. الصفحة الرئيسية (`/`)**
**المكونات:**
- Hero Section مع بحث ذكي
- العقارات المميزة (Featured Properties)
- الوكلاء المميزين (Top Agents)
- لماذا نحن (Why Choose Us)
- إحصائيات مباشرة (5000+ عقار، 500+ وكيل)
- CTA Section (دعوة للعمل)

**الميزات:**
- بحث فوري مع فلاتر ذكية
- انتقال سلس بين الأقسام
- تحميل lazy للصور

#### **2. صفحة البحث (`/properties`)**
**المكونات:**
- فلاتر متقدمة (جانبية أو أعلى حسب الشاشة)
- نتائج حية بالبطاقات
- تبديل Grid/List View
- خريطة تفاعلية (Google Maps)
- ترتيب (السعر، المساحة، الأحدث)

**الفلاتر:**
- الموقع (City/Area)
- نوع العقار (Villa/Apartment/etc.)
- السعر (Range Slider)
- عدد الغرف
- المساحة
- الحالة (Sale/Rent)

#### **3. تفاصيل العقار (`/property/:id`)**
**المكونات:**
- معرض صور تفاعلي (Gallery + Thumbnails)
- جولة 360 درجة (Virtual Tour)
- مواصفات كاملة (Specs Grid)
- خريطة الموقع (Google Maps)
- حاسبة الرهن العقاري
- نموذج الاتصال (Contact Form)
- زر WhatsApp
- معلومات الوكيل
- عقارات مشابهة (Related Properties)

**التفاعلات:**
- إضافة للمفضلة
- مشاركة العقار
- جدولة زيارة
- إرسال استفسار

#### **4. صفحة الوكلاء (`/agents`)**
**المكونات:**
- قائمة الوكلاء مع الفلاتر
- ملفات شخصية تفصيلية
- تقييمات ومراجعات
- عقارات الوكيل
- أزرار التواصل (Call/WhatsApp/Message)

**الفلاتر:**
- اللغات
- التقييم
- عدد العقارات
- التخصص

#### **5. لوحة المستخدم (`/dashboard`)**
**الأقسام:**
- نظرة عامة (Overview)
- المفضلة (Favorites)
- الاستفسارات (My Inquiries)
- جدول الزيارات (Scheduled Visits)
- الإشعارات (Notifications)
- إعدادات الحساب (Profile Settings)

#### **6. لوحة الإدارة (`/admin`)**
**الأقسام:**
- Dashboard (نظرة عامة بالإحصائيات)
- إدارة العقارات (Properties Management)
  - قائمة العقارات
  - إضافة عقار جديد
  - تعديل/حذف
  - رفع الصور
- إدارة المستخدمين (Users Management)
- إدارة الوكلاء (Agents Management)
- التحليلات والتقارير (Analytics & Reports)
- سجلات النشاط (Activity Logs)
- إعدادات النظام (System Settings)

**الصلاحيات:**
- Super Admin: وصول كامل
- Admin: إدارة العقارات والمستخدمين
- Agent: إدارة عقاراته فقط
- Viewer: عرض فقط

#### **7. صفحة الرؤى (`/insights`)**
**المكونات:**
- رسوم بيانية تفاعلية (Interactive Charts)
- تحليلات السوق (Market Analysis)
- توقعات الأسعار بالـ AI (Price Predictions)
- مقارنة المناطق (Area Comparison)
- تقارير شهرية/سنوية

#### **8. المدونة (`/blog`)**
**الصفحات:**
- قائمة المقالات (`/blog`)
- تفاصيل المقال (`/blog/:slug`)
- فئات (`/blog/category/:category`)
- وسوم (`/blog/tag/:tag`)

**الميزات:**
- بحث داخلي
- فلترة حسب الفئة/الوسم
- مقالات ذات صلة
- مشاركة اجتماعية

### **المكونات الأساسية**

#### **✅ تم إنشاؤها:**
- `Header` - التنقل الرئيسي
- `LanguageSwitcher` - تبديل اللغة (AR/EN)
- `ThemeToggle` - الوضع الليلي/النهاري
- `PropertyCard` - بطاقة العقار
- `AgentCard` - بطاقة الوكيل
- `SearchBar` - شريط البحث الذكي
- `HeroSection` - القسم البطل
- `ContactForm` - نموذج الاتصال
- `WhatsAppButton` - زر الواتساب
- `ChatBot` - بوت المحادثة الذكي
- `Footer` - التذييل

#### **🔄 مطلوب إنشاؤها:**
- `PropertyFilters` - فلاتر العقارات المتقدمة
- `MapView` - عرض الخريطة التفاعلية
- `MortgageCalculator` - حاسبة الرهن العقاري
- `ImageGallery` - معرض صور 360
- `ReviewCard` - بطاقة المراجعة/التقييم
- `StatCard` - بطاقة الإحصائيات
- `Sidebar` - القائمة الجانبية للإدارة
- `DataTable` - جدول البيانات (للإدارة)
- `ChartComponents` - مكونات الرسوم البيانية
- `NotificationBell` - جرس الإشعارات
- `PropertyComparison` - مقارنة العقارات
- `SavedSearches` - البحوث المحفوظة

---

## ⚙️ الواجهة الخلفية - APIs والخدمات

### **API Routes Structure**

#### **1. Properties APIs**
```
GET    /api/properties              // قائمة العقارات مع فلاتر
GET    /api/properties/:id          // تفاصيل عقار واحد
POST   /api/properties              // إضافة عقار (admin/agent)
PUT    /api/properties/:id          // تحديث عقار
DELETE /api/properties/:id          // حذف عقار
GET    /api/properties/featured     // العقارات المميزة
POST   /api/properties/:id/view     // زيادة عدد المشاهدات
GET    /api/properties/similar/:id  // عقارات مشابهة
```

**Query Parameters للفلترة:**
```typescript
{
  city?: string
  area?: string
  type?: string
  status?: 'sale' | 'rent'
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  featured?: boolean
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
}
```

#### **2. Auth APIs**
```
POST   /api/auth/login              // تسجيل دخول
POST   /api/auth/register           // تسجيل جديد
POST   /api/auth/logout             // تسجيل خروج
GET    /api/auth/me                 // معلومات المستخدم الحالي
PUT    /api/auth/profile            // تحديث الملف الشخصي
POST   /api/auth/change-password    // تغيير كلمة المرور
POST   /api/auth/forgot-password    // نسيت كلمة المرور
```

#### **3. Agents APIs**
```
GET    /api/agents                  // قائمة الوكلاء
GET    /api/agents/:id              // تفاصيل وكيل
GET    /api/agents/:id/properties   // عقارات الوكيل
POST   /api/agents/:id/review       // إضافة تقييم
GET    /api/agents/:id/reviews      // تقييمات الوكيل
PUT    /api/agents/:id              // تحديث معلومات الوكيل
```

#### **4. Favorites APIs**
```
GET    /api/favorites               // قائمة المفضلة للمستخدم
POST   /api/favorites               // إضافة للمفضلة
DELETE /api/favorites/:id           // إزالة من المفضلة
GET    /api/favorites/check/:propertyId  // التحقق إذا كان في المفضلة
```

#### **5. Inquiries APIs**
```
POST   /api/inquiries               // إرسال استفسار جديد
GET    /api/inquiries               // قائمة الاستفسارات (admin/agent)
GET    /api/inquiries/:id           // تفاصيل استفسار
PUT    /api/inquiries/:id           // تحديث حالة الاستفسار
DELETE /api/inquiries/:id           // حذف استفسار
```

#### **6. Chat APIs (Real-time)**
```
POST   /api/chat/send               // إرسال رسالة
GET    /api/chat/conversations      // قائمة المحادثات
GET    /api/chat/:conversationId    // رسائل محادثة معينة
PUT    /api/chat/:messageId/read    // تعليم كمقروء

WebSocket Events:
WS     /socket/chat
  - 'message:send'                   // إرسال رسالة
  - 'message:receive'                // استقبال رسالة
  - 'typing:start'                   // بدء الكتابة
  - 'typing:stop'                    // إيقاف الكتابة
  - 'agent:online'                   // وكيل متصل
  - 'agent:offline'                  // وكيل غير متصل
```

#### **7. AI APIs**
```
POST   /api/ai/generate-description     // توليد وصف عقار بالـ AI
POST   /api/ai/chat                     // بوت المحادثة الذكي
POST   /api/ai/recommend                // توصيات ذكية بناء على التفضيلات
POST   /api/ai/price-prediction         // توقع سعر العقار
```

#### **8. Analytics APIs**
```
GET    /api/analytics/overview          // نظرة عامة (KPIs)
GET    /api/analytics/properties        // تحليلات العقارات
GET    /api/analytics/market            // تحليلات السوق
GET    /api/analytics/user-activity     // نشاط المستخدمين
GET    /api/analytics/revenue           // الإيرادات
POST   /api/analytics/export            // تصدير تقرير (PDF/Excel)
```

#### **9. Blog APIs**
```
GET    /api/blog/posts                  // قائمة المقالات
GET    /api/blog/posts/:slug            // تفاصيل مقال
POST   /api/blog/posts                  // إضافة مقال (admin)
PUT    /api/blog/posts/:id              // تحديث مقال
DELETE /api/blog/posts/:id              // حذف مقال
GET    /api/blog/categories             // الفئات
GET    /api/blog/tags                   // الوسوم
```

#### **10. Notifications APIs**
```
GET    /api/notifications               // قائمة الإشعارات
PUT    /api/notifications/:id/read      // تعليم كمقروء
PUT    /api/notifications/read-all      // تعليم الكل كمقروء
DELETE /api/notifications/:id           // حذف إشعار
POST   /api/notifications/settings      // إعدادات الإشعارات
```

#### **11. Upload APIs**
```
POST   /api/upload/image                // رفع صورة واحدة
POST   /api/upload/images               // رفع صور متعددة
DELETE /api/upload/:fileId              // حذف صورة
```

---

## 🔗 التكاملات الخارجية

### **1. OpenAI API**
**الاستخدام:**
- بوت المحادثة الذكي (GPT-4)
- توليد أوصاف العقارات تلقائياً
- توصيات ذكية للمستخدمين
- تحليل وتوقع أسعار السوق

**الإعداد:**
```env
OPENAI_API_KEY=sk-...
```

**المكون:**
```typescript
// server/services/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat completion
async function chatWithBot(message: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful real estate assistant..." },
      { role: "user", content: message }
    ]
  });
  return completion.choices[0].message.content;
}

// Generate property description
async function generateDescription(propertyData: any) {
  const prompt = `Generate a compelling property description for: ${JSON.stringify(propertyData)}`;
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
  return completion.choices[0].message.content;
}
```

### **2. Twilio (WhatsApp Business)**
**الاستخدام:**
- إرسال رسائل WhatsApp للعملاء
- إشعارات فورية للاستفسارات
- تأكيد المواعيد

**الإعداد:**
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**المكون:**
```typescript
// server/services/whatsapp.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppMessage(to: string, message: string) {
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: message
  });
}
```

### **3. Google Maps API**
**الاستخدام:**
- عرض مواقع العقارات على الخريطة
- البحث الجغرافي
- حساب المسافات
- Geocoding (تحويل العنوان لإحداثيات)

**الإعداد:**
```env
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

**المكون (Frontend):**
```typescript
// client/src/components/MapView.tsx
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

function MapView({ properties }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      center={{ lat: 25.2048, lng: 55.2708 }} // Dubai
      zoom={11}
    >
      {properties.map(property => (
        <Marker
          key={property.id}
          position={{ lat: property.lat, lng: property.lng }}
        />
      ))}
    </GoogleMap>
  );
}
```

### **4. Google Analytics 4**
**الاستخدام:**
- تتبع الزيارات والتحويلات
- تحليل سلوك المستخدمين
- قياس أداء الحملات

**الإعداد:**
```env
VITE_GA_MEASUREMENT_ID=G-...
```

**التكامل:**
```typescript
// client/src/lib/analytics.ts
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// Track page view
export function trackPageView(path: string) {
  ReactGA.send({ hitType: "pageview", page: path });
}

// Track event
export function trackEvent(category: string, action: string) {
  ReactGA.event({ category, action });
}
```

### **5. Meta Pixel (Facebook Pixel)**
**الاستخدام:**
- تتبع الحملات الإعلانية على Meta
- إعادة الاستهداف
- قياس التحويلات

**الإعداد:**
```html
<!-- client/index.html -->
<script>
  !function(f,b,e,v,n,t,s){...}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

### **6. Cloudinary / AWS S3**
**الاستخدام:**
- تخزين ورفع الصور
- تحسين الصور تلقائياً
- CDN للأداء السريع

**خيار 1: Cloudinary**
```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```typescript
// server/services/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(file: Buffer) {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'properties',
    transformation: [{ width: 1200, height: 800, crop: 'fill' }]
  });
  return result.secure_url;
}
```

**خيار 2: AWS S3**
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=aqarcity-properties
AWS_REGION=me-south-1
```

### **7. Nodemailer**
**الاستخدام:**
- إرسال إشعارات البريد الإلكتروني
- تأكيد التسجيل
- إعادة تعيين كلمة المرور
- إشعارات الاستفسارات

**الإعداد:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@aqarcity.ae
EMAIL_PASS=...
EMAIL_FROM=Aqar City <info@aqarcity.ae>
```

**المكون:**
```typescript
// server/services/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
}
```

---

## 📱 PWA Configuration

### **1. Manifest (`public/manifest.json`)**
```json
{
  "name": "Aqar City UAE - Premium Real Estate",
  "short_name": "Aqar City",
  "description": "Find luxury properties in Dubai and UAE",
  "theme_color": "#0b3d2e",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait-primary",
  "scope": "/",
  "start_url": "/",
  "lang": "ar",
  "dir": "rtl",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

### **2. Service Worker (`public/sw.js`)**
```javascript
const CACHE_NAME = 'aqarcity-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### **3. تسجيل Service Worker**
```typescript
// client/src/registerSW.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
}
```

---

## 🌍 Internationalization (i18n)

### **الإعداد**
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### **التكوين**
```typescript
// client/src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### **ملفات الترجمة**
```json
// client/src/i18n/locales/en.json
{
  "nav": {
    "home": "Home",
    "properties": "Properties",
    "agents": "Agents",
    "insights": "Insights",
    "blog": "Blog"
  },
  "search": {
    "placeholder": "Search properties...",
    "location": "Location",
    "propertyType": "Property Type",
    "priceRange": "Price Range"
  },
  "property": {
    "bedrooms": "Bedrooms",
    "bathrooms": "Bathrooms",
    "area": "Area",
    "price": "Price"
  }
}
```

```json
// client/src/i18n/locales/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "properties": "العقارات",
    "agents": "الوكلاء",
    "insights": "الرؤى",
    "blog": "المدونة"
  },
  "search": {
    "placeholder": "ابحث عن عقارات...",
    "location": "الموقع",
    "propertyType": "نوع العقار",
    "priceRange": "نطاق السعر"
  },
  "property": {
    "bedrooms": "غرف النوم",
    "bathrooms": "دورات المياه",
    "area": "المساحة",
    "price": "السعر"
  }
}
```

### **الاستخدام في المكونات**
```typescript
import { useTranslation } from 'react-i18next';

function SearchBar() {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div>
      <input placeholder={t('search.placeholder')} />
      <button onClick={() => changeLanguage('ar')}>العربية</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

---

## 🔄 ترتيب التنفيذ التفصيلي

### **المرحلة 1: الإعداد الأولي** ✅ (تم)
- [x] إنشاء design_guidelines.md
- [x] إعداد Tailwind و Shadcn UI
- [x] إنشاء المكونات الأساسية (Header, Footer, PropertyCard, etc.)
- [x] الصفحة الرئيسية وتفاصيل العقار
- [x] تكامل Dark Mode و Language Switcher

### **المرحلة 2: قاعدة البيانات والمصادقة**
1. ✅ إنشاء PostgreSQL Database (تم)
2. إنشاء Schema الكامل في `shared/schema.ts`
   - Users table
   - Properties table
   - Agents table
   - Developers table
   - Favorites table
   - Inquiries table
   - Chat_Messages table
   - Reviews table
   - Blog_Posts table
   - Notifications table
3. إعداد Drizzle ORM وتشغيل Migrations
   - `drizzle-kit generate`
   - `drizzle-kit migrate`
   - إنشاء seed data للاختبار
4. **🔗 تكامل Replit Auth** (Integration 1)
   - البحث عن integration: `search_integrations("authentication")`
   - إعداد OAuth providers (Google, Apple, GitHub)
   - إنشاء middleware للمصادقة في `server/middleware/auth.ts`
   - نظام الصلاحيات (Roles & Permissions)
   - حماية المسارات بـ middleware
5. إنشاء Auth APIs في `server/routes/auth.ts`
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/logout
   - GET /api/auth/me
   - PUT /api/auth/profile

### **المرحلة 3: APIs الأساسية**
1. Properties APIs في `server/routes/properties.ts`
   - CRUD operations (Create, Read, Update, Delete)
   - Filtering & Search بـ Query Parameters
   - Pagination
   - View counter increment
2. Agents APIs في `server/routes/agents.ts`
   - Profile management
   - Reviews system
   - Agent properties listing
3. Favorites APIs في `server/routes/favorites.ts`
   - Add/Remove/List favorites
4. Inquiries APIs في `server/routes/inquiries.ts`
   - Submit inquiry
   - List inquiries (admin/agent)
   - Update inquiry status
5. **🔗 Upload Service** (Integration 2)
   - **خيار 1: Cloudinary** - إعداد `server/services/cloudinary.ts`
   - **خيار 2: AWS S3** - إعداد `server/services/s3.ts`
   - Image optimization تلقائي
   - Multiple images upload
   - Delete images API

### **المرحلة 4: الميزات المتقدمة - Frontend**
1. **🔗 تكامل Google Maps API** (Integration 3)
   - إضافة `VITE_GOOGLE_MAPS_API_KEY` في `.env`
   - تثبيت `@react-google-maps/api`
   - إنشاء MapView component في `client/src/components/property/MapView.tsx`
   - Property markers مع info windows
   - Clustering للعقارات الكثيرة
   - Geocoding للعناوين
2. نظام البحث المتقدم
   - PropertyFilters component مع جميع الفلاتر
   - Real-time search مع debouncing
   - Saved searches في localStorage/database
   - URL state management للفلاتر
3. Property Detail enhancements
   - ImageGallery with 360° view
   - MortgageCalculator component
   - Related properties algorithm
   - Social sharing buttons
4. نظام التقييمات
   - ReviewCard component
   - Star rating system
   - Review submission form
   - Review moderation (admin)

### **المرحلة 5: Real-time Features**
1. **🔗 إعداد Socket.io** (Integration 4)
   - تثبيت `socket.io` و `socket.io-client`
   - Server setup في `server/socket.ts`
   - Client connection في `client/src/lib/socket.ts`
   - Event handlers (connect, disconnect, error)
   - Rooms للمحادثات الخاصة
2. نظام المحادثة الفورية
   - Chat UI components (ChatWindow, MessageBubble)
   - Real-time messages عبر Socket.io
   - Typing indicators
   - Online/Offline status للوكلاء
   - Message history من Database
   - Unread message counter
3. **🔗 تكامل OpenAI API** (Integration 5)
   - إضافة `OPENAI_API_KEY` في `.env`
   - إنشاء `server/services/openai.ts`
   - Chatbot implementation مع GPT-4
   - Context management للمحادثات
   - Response streaming للرد السريع
   - Property description generator
   - Smart recommendations engine
4. **🔗 تكامل Twilio WhatsApp** (Integration 6)
   - البحث: `search_integrations("twilio")`
   - إضافة متغيرات البيئة (TWILIO_ACCOUNT_SID, etc.)
   - إنشاء `server/services/whatsapp.ts`
   - Message sending للعملاء
   - Template messages معتمدة
   - Webhook handling للرسائل الواردة
   - Integration مع نظام الاستفسارات
5. نظام الإشعارات
   - **🔗 Nodemailer** (Integration 7) - Email notifications
   - Push notifications (Web Push API)
   - In-app notifications مع Socket.io
   - Notification preferences للمستخدمين
   - Notification center UI

### **المرحلة 6: لوحة التحكم الإدارية**
1. Sidebar navigation
   - استخدام Shadcn Sidebar من `@/components/ui/sidebar`
   - Menu items حسب الصلاحيات
   - Collapsible sidebar للموبايل
2. Admin Dashboard
   - KPIs & Stats cards (عدد العقارات، المستخدمين، الاستفسارات)
   - Recent activity feed
   - Quick actions shortcuts
   - Charts overview
3. Properties Management (`/admin/properties`)
   - DataTable component مع فلترة وترتيب
   - CRUD UI كامل
   - Bulk actions (delete, feature, publish)
   - Image upload interface متقدم
   - Property status management
4. Users & Agents Management (`/admin/users`, `/admin/agents`)
   - User list مع بحث وفلترة
   - Role management (تغيير الصلاحيات)
   - Agent verification workflow
   - Ban/Unban users
   - User activity logs
5. Analytics & Reports (`/admin/analytics`)
   - Charts & Graphs (Line, Bar, Pie)
   - Export functionality (PDF/Excel)
   - Custom date ranges
   - Comparison tools
6. Activity Logs (`/admin/logs`)
   - User actions logging
   - System events
   - Error tracking
   - Audit trail
7. System Settings (`/admin/settings`)
   - General settings
   - Email templates
   - WhatsApp templates
   - SEO settings
   - Feature flags

### **المرحلة 7: المدونة والمحتوى**
1. Blog APIs (Backend)
2. Blog Pages (Frontend)
   - Post list
   - Post detail
   - Category pages
   - Tag pages
3. Rich Text Editor
   - TinyMCE or Quill.js
   - Image upload
   - Media library
4. SEO optimization
   - Meta tags
   - Open Graph
   - Structured data

### **المرحلة 8: التحليلات والـ AI**
1. **🔗 Google Analytics 4 Integration** (Integration 8)
   - البحث: `search_integrations("google analytics")`
   - إضافة `VITE_GA_MEASUREMENT_ID` في `.env`
   - إنشاء `client/src/lib/analytics.ts`
   - Track page views
   - Track events (property views, inquiries, etc.)
   - E-commerce tracking للعقارات
   - User behavior analysis
2. **🔗 Meta Pixel Integration** (Integration 9)
   - إضافة `VITE_META_PIXEL_ID` في `.env`
   - إضافة Pixel code في `client/index.html`
   - Track conversions
   - Custom audiences
   - Retargeting campaigns
3. Analytics Dashboard في `/insights`
   - User analytics (sessions, bounce rate, etc.)
   - Property analytics (views, favorites, inquiries)
   - Market insights (price trends, popular areas)
   - Conversion funnels
   - Real-time visitors
4. **AI Features المتقدمة**
   - Property description generator (GPT-4)
   - Smart recommendations بناءً على سلوك المستخدم
   - Price prediction model (Machine Learning)
   - Investment insights و ROI calculator
   - Market trend analysis

### **المرحلة 9: PWA و i18n**
1. PWA Setup
   - Create manifest.json
   - Generate icons
   - Service Worker implementation
   - Offline page
   - Add to home screen prompt
2. Internationalization
   - Setup i18next
   - Create translation files (AR/EN)
   - Translate all content
   - RTL/LTR switching
   - Language persistence

### **المرحلة 10: الاختبار والتحسين**
1. Unit Tests
   - Components testing
   - API testing
   - Utility functions
2. Integration Tests
   - API integration
   - Database operations
3. E2E Tests (Playwright)
   - Critical user flows
   - Property search
   - Inquiry submission
   - Admin operations
4. Performance Optimization
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle size reduction
5. Security Audit
   - SQL injection prevention
   - XSS protection
   - CSRF tokens
   - Rate limiting
6. SEO Audit
   - Meta tags
   - Sitemap
   - Robots.txt
   - Structured data
7. Accessibility (A11y)
   - WCAG compliance
   - Keyboard navigation
   - Screen reader support

### **المرحلة 11: النشر والإطلاق**
1. Environment Setup
   - Production env variables
   - Database migration
2. Domain & SSL
   - Domain setup (aqarcity.ae)
   - SSL certificate
3. Monitoring
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring
4. Marketing Launch
   - Landing page optimization
   - Social media setup
   - Email marketing setup
   - Google Ads campaigns
   - Meta Ads campaigns

---

## 📂 هيكل الملفات النهائي

```
aqar-city-uae/
├── client/
│   ├── public/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   ├── icons/
│   │   └── screenshots/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── property/
│   │   │   │   ├── PropertyCard.tsx
│   │   │   │   ├── PropertyFilters.tsx
│   │   │   │   ├── PropertyDetail.tsx
│   │   │   │   ├── ImageGallery.tsx
│   │   │   │   ├── MapView.tsx
│   │   │   │   └── MortgageCalculator.tsx
│   │   │   ├── agent/
│   │   │   │   ├── AgentCard.tsx
│   │   │   │   ├── AgentProfile.tsx
│   │   │   │   └── ReviewCard.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatBot.tsx
│   │   │   │   ├── ChatWindow.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── Charts/
│   │   │   └── shared/
│   │   │       ├── SearchBar.tsx
│   │   │       ├── ContactForm.tsx
│   │   │       ├── WhatsAppButton.tsx
│   │   │       ├── LanguageSwitcher.tsx
│   │   │       └── ThemeToggle.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Properties.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   ├── Agents.tsx
│   │   │   ├── AgentProfile.tsx
│   │   │   ├── Insights.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Index.tsx
│   │   │   │   ├── Favorites.tsx
│   │   │   │   ├── Inquiries.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── PropertiesManagement.tsx
│   │   │   │   ├── UsersManagement.tsx
│   │   │   │   ├── AgentsManagement.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   └── NotFound.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProperties.ts
│   │   │   ├── useChat.ts
│   │   │   └── useNotifications.ts
│   │   ├── lib/
│   │   │   ├── queryClient.ts
│   │   │   ├── analytics.ts
│   │   │   └── socket.ts
│   │   ├── i18n/
│   │   │   ├── config.ts
│   │   │   └── locales/
│   │   │       ├── en.json
│   │   │       └── ar.json
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── registerSW.ts
│   └── index.html
├── server/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── properties.ts
│   │   ├── agents.ts
│   │   ├── favorites.ts
│   │   ├── inquiries.ts
│   │   ├── chat.ts
│   │   ├── blog.ts
│   │   ├── analytics.ts
│   │   ├── notifications.ts
│   │   └── upload.ts
│   ├── services/
│   │   ├── openai.ts
│   │   ├── whatsapp.ts
│   │   ├── email.ts
│   │   ├── storage.ts            # Cloudinary/S3
│   │   └── analytics.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimit.ts
│   ├── storage.ts
│   ├── socket.ts
│   ├── index.ts
│   └── vite.ts
├── shared/
│   └── schema.ts                  # Drizzle schemas & types
├── drizzle/
│   ├── migrations/
│   └── seed.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── drizzle.config.ts
├── vite.config.ts
├── design_guidelines.md
├── PROJECT_PLAN.md               # هذا الملف
└── README.md
```

---

## 🔐 الأمان (Security)

### **1. المصادقة والتفويض**
- JWT tokens مع expiry
- Refresh tokens
- Role-based access control (RBAC)
- OAuth 2.0 للتسجيل الاجتماعي

### **2. حماية البيانات**
- Password hashing (bcrypt)
- Input validation (Zod schemas)
- SQL injection prevention (Drizzle ORM)
- XSS protection (sanitize inputs)
- CSRF tokens

### **3. Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

### **4. Environment Variables**
- جميع الأسرار في `.env`
- عدم commit الـ `.env`
- استخدام `.env.example` للتوثيق

---

## 📊 الأداء (Performance)

### **1. Frontend Optimization**
- Code splitting (React.lazy)
- Image lazy loading
- Bundle size optimization
- Tree shaking
- Minification

### **2. Backend Optimization**
- Database indexing
- Query optimization
- Caching (Redis)
- Connection pooling
- Response compression (gzip)

### **3. CDN & Caching**
- Static assets on CDN
- Browser caching headers
- Service Worker caching

---

## 🧪 الاختبار (Testing)

### **1. Unit Tests**
```bash
npm install --save-dev vitest @testing-library/react
```

### **2. Integration Tests**
```bash
npm install --save-dev supertest
```

### **3. E2E Tests**
```bash
npm install --save-dev @playwright/test
```

### **مثال على اختبار:**
```typescript
// PropertyCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PropertyCard } from './PropertyCard';

test('renders property card', () => {
  render(
    <PropertyCard
      title="Luxury Villa"
      price="AED 15,500,000"
      bedrooms={5}
      bathrooms={6}
    />
  );
  expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
});
```

---

## 📈 KPIs ومؤشرات النجاح

### **التقنية**
- ✅ Page Load Time < 3s
- ✅ Lighthouse Score > 90
- ✅ Uptime > 99.9%
- ✅ API Response Time < 200ms

### **الأعمال**
- 📊 Monthly Active Users (MAU)
- 📊 Property Views
- 📊 Inquiry Conversion Rate
- 📊 Agent Response Time
- 📊 Customer Satisfaction Score

---

---

## 🔗 ملخص التكاملات الخارجية ومراحل التنفيذ

| # | التكامل | المرحلة | الملفات الرئيسية | متغيرات البيئة |
|---|---------|---------|------------------|-----------------|
| 1 | **Replit Auth** | المرحلة 2 | `server/middleware/auth.ts` | (Blueprint) |
| 2 | **Cloudinary/S3** | المرحلة 3 | `server/services/storage.ts` | `CLOUDINARY_*` أو `AWS_*` |
| 3 | **Google Maps** | المرحلة 4 | `client/src/components/property/MapView.tsx` | `VITE_GOOGLE_MAPS_API_KEY` |
| 4 | **Socket.io** | المرحلة 5 | `server/socket.ts`, `client/src/lib/socket.ts` | - |
| 5 | **OpenAI API** | المرحلة 5 | `server/services/openai.ts` | `OPENAI_API_KEY` |
| 6 | **Twilio WhatsApp** | المرحلة 5 | `server/services/whatsapp.ts` | `TWILIO_*` |
| 7 | **Nodemailer** | المرحلة 5 | `server/services/email.ts` | `EMAIL_*` |
| 8 | **Google Analytics** | المرحلة 8 | `client/src/lib/analytics.ts` | `VITE_GA_MEASUREMENT_ID` |
| 9 | **Meta Pixel** | المرحلة 8 | `client/index.html` | `VITE_META_PIXEL_ID` |

---

## 📋 قائمة المتغيرات البيئية المطلوبة

### **ملف `.env.example`**
```env
# Database (Replit Built-in)
DATABASE_URL=postgresql://...

# Authentication (Replit Auth Blueprint)
# يتم إعداده تلقائياً عبر Blueprint

# OpenAI
OPENAI_API_KEY=sk-...

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=info@aqarcity.ae
EMAIL_PASS=...
EMAIL_FROM=Aqar City <info@aqarcity.ae>

# Cloud Storage (اختر واحد)
# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# أو AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=aqarcity-properties
AWS_REGION=me-south-1

# Frontend Environment Variables
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_GA_MEASUREMENT_ID=G-...
VITE_META_PIXEL_ID=...

# Session Secret
SESSION_SECRET=your-secret-key-here
```

---

## 🚀 الخطوات التالية

1. **✅ موافقة المستخدم على المخطط**
2. **البدء بالمرحلة 2: قاعدة البيانات والمصادقة**
   - إنشاء Database Schema
   - تكامل Replit Auth
   - إنشاء Auth APIs
3. **تنفيذ المراحل بالترتيب (3-11)**
   - كل مرحلة تبني على السابقة
   - اختبار بعد كل مرحلة
4. **اختبار شامل (المرحلة 10)**
   - Unit, Integration, E2E tests
   - Performance & Security audit
5. **النشر والإطلاق (المرحلة 11)**
   - Production deployment
   - Monitoring setup
   - Marketing launch

---

**تم إعداد هذا المخطط بواسطة:** Replit Agent  
**التاريخ:** أكتوبر 2024  
**الإصدار:** 1.1 (محدّث مع ربط التكاملات)
