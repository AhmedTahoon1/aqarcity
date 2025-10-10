import express from 'express';
import { db } from '../../db';
import { guestSearches } from '../../shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { verificationService } from '../services/verification';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting للضيوف
const guestSearchLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: process.env.NODE_ENV === 'development' ? 100 : 3, // 100 للتطوير، 3 للإنتاج
  message: { error: 'تم تجاوز الحد الأقصى للبحوثات المحفوظة' },
  standardHeaders: true,
  legacyHeaders: false,
});

const verificationLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // ساعة واحدة
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // 100 للتطوير، 5 للإنتاج
  message: { error: 'تم تجاوز الحد الأقصى لمحاولات التحقق' },
});

// إنشاء بحث للضيوف
router.post('/', guestSearchLimit, async (req, res) => {
  console.log('🚀 تم استلام طلب إنشاء بحث ضيف');
  console.log('📝 البيانات المستلمة:', req.body);
  
  try {
    const { contactType, contactValue, name, searchCriteria, alertsEnabled = true, alertFrequency = 'instant' } = req.body;
    console.log('📞 نوع التواصل:', contactType);

    // التحقق من صحة البيانات
    if (!contactType || !contactValue || !name || !searchCriteria) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (!['email', 'whatsapp'].includes(contactType)) {
      return res.status(400).json({ error: 'نوع التواصل غير صحيح' });
    }

    // التحقق من صحة الإيميل
    if (contactType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue)) {
        return res.status(400).json({ error: 'عنوان البريد الإلكتروني غير صحيح' });
      }
    }

    // التحقق من رقم الهاتف وإضافة كود الإمارات
    if (contactType === 'whatsapp') {
      let phoneNumber = contactValue.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // إضافة كود الإمارات إذا لم يكن موجوداً
      if (!phoneNumber.startsWith('+971') && !phoneNumber.startsWith('971')) {
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '+971' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('5')) {
          phoneNumber = '+971' + phoneNumber;
        } else {
          phoneNumber = '+971' + phoneNumber;
        }
      } else if (phoneNumber.startsWith('971')) {
        phoneNumber = '+' + phoneNumber;
      }
      
      // التحقق من صحة رقم الإمارات
      const uaePhoneRegex = /^\+971[0-9]{8,9}$/;
      if (!uaePhoneRegex.test(phoneNumber)) {
        return res.status(400).json({ error: 'رقم الهاتف غير صحيح. يجب أن يكون رقم إماراتي صحيح' });
      }
      
      contactValue = phoneNumber;
    }

    // التحقق من عدم تجاوز الحد الأقصى للبحوثات لنفس جهة الاتصال (فقط في الإنتاج)
    if (process.env.NODE_ENV !== 'development') {
      const existingSearches = await db.select({ count: sql`count(*)` })
        .from(guestSearches)
        .where(and(
          eq(guestSearches.contactValue, contactValue),
          eq(guestSearches.isActive, true)
        ));

      if (Number(existingSearches[0].count) >= 3) {
        return res.status(400).json({ error: 'تم تجاوز الحد الأقصى للبحوثات المحفوظة (3 بحوثات)' });
      }
    }

    // إنشاء رمز التحقق
    const token = verificationService.generateToken();
    const expiresAt = contactType === 'whatsapp' 
      ? new Date(Date.now() + 10 * 60 * 1000) // 10 دقائق للواتساب
      : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعة للإيميل

    // حفظ البحث
    const newSearch = await db.insert(guestSearches).values({
      contactType: contactType as 'email' | 'whatsapp',
      contactValue,
      name,
      searchCriteria,
      alertsEnabled,
      alertFrequency: alertFrequency as 'instant' | 'daily' | 'weekly',
      verificationToken: token,
      verificationExpiresAt: expiresAt,
    }).returning();

    // إرسال رسالة التحقق
    if (contactType === 'email') {
      await verificationService.sendEmailVerification(contactValue, token, name);
    } else {
      console.log('📱 بدء إرسال رمز WhatsApp...');
      const code = verificationService.generateVerificationCode();
      console.log('🔢 تم إنشاء الرمز:', code);
      
      await db.update(guestSearches)
        .set({ verificationToken: code })
        .where(eq(guestSearches.id, newSearch[0].id));
      
      console.log('💾 تم حفظ الرمز في قاعدة البيانات');
      await verificationService.sendWhatsAppVerification(contactValue, code, name);
      console.log('✅ تم إرسال رمز WhatsApp بنجاح');
    }

    res.status(201).json({
      message: 'تم إرسال رسالة التحقق بنجاح',
      searchId: newSearch[0].id,
      contactType,
      expiresAt
    });

  } catch (error) {
    console.error('Guest search creation error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء حفظ البحث' });
  }
});

// تأكيد البحث (للإيميل)
router.get('/verify/:token', verificationLimit, async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'رمز التحقق مطلوب' });
    }

    const result = await verificationService.verifyToken(token);

    if (result.success) {
      res.json({ 
        message: 'تم تفعيل البحث بنجاح! ستبدأ في تلقي التنبيهات قريباً.',
        searchId: result.searchId 
      });
    } else {
      res.status(400).json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' });
    }

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء التحقق' });
  }
});

// تأكيد رمز الواتس اب
router.post('/verify-whatsapp', verificationLimit, async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'رقم الهاتف ورمز التحقق مطلوبان' });
    }

    const result = await verificationService.verifyWhatsAppCode(phone, code);

    if (result.success) {
      res.json({ 
        message: 'تم تفعيل البحث بنجاح! ستبدأ في تلقي التنبيهات قريباً.',
        searchId: result.searchId 
      });
    } else {
      res.status(400).json({ error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' });
    }

  } catch (error) {
    console.error('WhatsApp verification error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء التحقق' });
  }
});

// معالجة رسائل إيقاف WhatsApp
router.post('/whatsapp-webhook', async (req, res) => {
  try {
    const { Body, From } = req.body;
    
    if (Body && Body.toUpperCase().includes('STOP')) {
      const phone = From.replace('whatsapp:', '');
      
      // إيقاف جميع التنبيهات لهذا الرقم
      await db.update(guestSearches)
        .set({ 
          alertsEnabled: false,
          updatedAt: new Date()
        })
        .where(eq(guestSearches.contactValue, phone));
      
      console.log(`🚫 تم إيقاف التنبيهات لـ ${phone}`);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).send('Error');
  }
});

// إعادة إرسال رمز الواتس اب
router.post('/resend-whatsapp', verificationLimit, async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'رقم الهاتف مطلوب' });
    }

    // البحث عن البحث غير المفعل
    const search = await db.select().from(guestSearches)
      .where(and(
        eq(guestSearches.contactValue, phone),
        eq(guestSearches.contactType, 'whatsapp'),
        eq(guestSearches.isVerified, false)
      ))
      .limit(1);

    if (!search.length) {
      return res.status(404).json({ error: 'لم يتم العثور على بحث غير مفعل لهذا الرقم' });
    }

    // إنشاء رمز جديد
    const newCode = verificationService.generateVerificationCode();
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقائق

    // تحديث الرمز في قاعدة البيانات
    await db.update(guestSearches)
      .set({ 
        verificationToken: newCode,
        verificationExpiresAt: newExpiresAt,
        updatedAt: new Date()
      })
      .where(eq(guestSearches.id, search[0].id));

    // إرسال الرمز الجديد
    await verificationService.sendWhatsAppVerification(phone, newCode, search[0].name);

    res.json({ message: 'تم إعادة إرسال رمز التحقق بنجاح' });

  } catch (error) {
    console.error('Resend WhatsApp code error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إعادة الإرسال' });
  }
});

// إلغاء الاشتراك
router.get('/unsubscribe/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const search = await db.select().from(guestSearches)
      .where(eq(guestSearches.verificationToken, token))
      .limit(1);

    if (!search.length) {
      return res.status(404).json({ error: 'البحث غير موجود' });
    }

    await db.update(guestSearches)
      .set({ 
        isActive: false,
        alertsEnabled: false,
        updatedAt: new Date()
      })
      .where(eq(guestSearches.id, search[0].id));

    res.json({ message: 'تم إلغاء الاشتراك بنجاح' });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إلغاء الاشتراك' });
  }
});

// الحصول على تفاصيل البحث (للمعاينة)
router.get('/:token/preview', async (req, res) => {
  try {
    const { token } = req.params;

    const search = await db.select().from(guestSearches)
      .where(eq(guestSearches.verificationToken, token))
      .limit(1);

    if (!search.length) {
      return res.status(404).json({ error: 'البحث غير موجود' });
    }

    const searchData = search[0];
    res.json({
      id: searchData.id,
      name: searchData.name,
      contactType: searchData.contactType,
      alertsEnabled: searchData.alertsEnabled,
      alertFrequency: searchData.alertFrequency,
      isVerified: searchData.isVerified,
      createdAt: searchData.createdAt
    });

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب البيانات' });
  }
});

export default router;