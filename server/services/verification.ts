import crypto from 'crypto';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { db } from '../../db';
import { guestSearches } from '../../shared/schema';
import { eq, and, lt } from 'drizzle-orm';

export class VerificationService {
  private transporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailVerification(email: string, token: string, searchName: string): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-search/${token}`;
    
    const unsubscribeUrl = `${process.env.CLIENT_URL}/unsubscribe/${token}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'تأكيد حفظ البحث - عقار سيتي الإمارات',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">عقار سيتي الإمارات</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">تأكيد حفظ البحث</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">مرحباً!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              شكراً لك على حفظ البحث "<strong>${searchName}</strong>" في موقع عقار سيتي الإمارات.
            </p>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              لتفعيل التنبيهات وبدء تلقي إشعارات العقارات الجديدة، يرجى النقر على الزر أدناه:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                تأكيد البحث المحفوظ
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0;">
                🔔 <strong>ستتلقى تنبيهات فورية</strong> عند توفر عقارات جديدة تطابق بحثك.
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              إذا لم تقم بحفظ هذا البحث، يمكنك تجاهل هذه الرسالة.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">© 2024 عقار سيتي الإمارات - جميع الحقوق محفوظة</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">
              لإلغاء الاشتراك في التنبيهات: <a href="${unsubscribeUrl}" style="color: #ccc;">اضغط هنا</a>
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWhatsAppVerification(phone: string, code: string, searchName: string): Promise<void> {
    console.log('🚀 دخلنا وظيفة sendWhatsAppVerification');
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    
    if (process.env.NODE_ENV === 'development') {
      // في بيئة التطوير، فقط طباعة الرمز
      console.log(`📱 WhatsApp رمز التحقق لـ ${phone}: ${code}`);
      console.log(`🔍 اسم البحث: ${searchName}`);
      console.log('✅ تم عرض الرمز في console');
      return;
    }

    console.log('🎆 سيتم إرسال رسالة WhatsApp فعلية...');
    try {
      const message = `🏠 *عقار سيتي الإمارات*\n\nرمز التحقق لحفظ البحث "${searchName}":\n\n*${code}*\n\nيرجى إدخال هذا الرمز لتفعيل التنبيهات.\n\n🔔 ستتلقى تنبيهات فورية عند توفر عقارات جديدة.\n\nصالح لمدة 10 دقائق فقط.\n\nلإيقاف التنبيهات أرسل: *STOP*`;
      
      await this.twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phone}`,
        body: message
      });
      console.log('✅ تم إرسال رسالة WhatsApp بنجاح');
    } catch (error) {
      console.error('❌ WhatsApp verification error:', error);
      throw new Error('فشل في إرسال رمز التحقق عبر الواتس اب');
    }
  }

  async verifyToken(token: string): Promise<{ success: boolean; searchId?: string }> {
    const search = await db.select().from(guestSearches)
      .where(and(
        eq(guestSearches.verificationToken, token),
        eq(guestSearches.isVerified, false)
      ))
      .limit(1);

    if (!search.length) {
      return { success: false };
    }

    const searchData = search[0];
    
    if (searchData.verificationExpiresAt && searchData.verificationExpiresAt < new Date()) {
      return { success: false };
    }

    await db.update(guestSearches)
      .set({ 
        isVerified: true,
        updatedAt: new Date()
      })
      .where(eq(guestSearches.id, searchData.id));

    return { success: true, searchId: searchData.id };
  }

  async verifyWhatsAppCode(phone: string, code: string): Promise<{ success: boolean; searchId?: string }> {
    const search = await db.select().from(guestSearches)
      .where(and(
        eq(guestSearches.contactValue, phone),
        eq(guestSearches.verificationToken, code),
        eq(guestSearches.isVerified, false)
      ))
      .limit(1);

    if (!search.length) {
      return { success: false };
    }

    const searchData = search[0];
    
    if (searchData.verificationExpiresAt && searchData.verificationExpiresAt < new Date()) {
      return { success: false };
    }

    await db.update(guestSearches)
      .set({ 
        isVerified: true,
        updatedAt: new Date()
      })
      .where(eq(guestSearches.id, searchData.id));

    return { success: true, searchId: searchData.id };
  }
}

export const verificationService = new VerificationService();