// اختبار بسيط لإرسال رسالة WhatsApp
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function testWhatsApp() {
  try {
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: 'whatsapp:+971501234567', // رقم اختبار
      body: '🏠 *عقار سيتي الإمارات*\n\nرمز التحقق لحفظ البحث:\n\n*123456*\n\nيرجى إدخال هذا الرمز لتفعيل التنبيهات.\n\nصالح لمدة 10 دقائق فقط.'
    });

    console.log('✅ تم إرسال الرسالة بنجاح:', message.sid);
  } catch (error) {
    console.error('❌ خطأ في إرسال الرسالة:', error.message);
  }
}

testWhatsApp();