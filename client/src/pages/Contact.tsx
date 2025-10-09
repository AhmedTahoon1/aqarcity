import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { inquiriesAPI } from '../lib/api';
import { AnimatedButton, StaggeredList } from '../components/animations';
import { motion } from 'framer-motion';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await inquiriesAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `${formData.subject}\n\n${formData.message}`,
        propertyId: null
      });
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(isArabic ? 'حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.' : 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: isArabic ? 'الهاتف' : 'Phone',
      details: ['+971 4 123 4567', '+971 50 123 4567'],
      action: isArabic ? 'اتصل الآن' : 'Call Now',
      link: 'tel:+97141234567'
    },
    {
      icon: Mail,
      title: isArabic ? 'البريد الإلكتروني' : 'Email',
      details: ['info@aqarcity.ae', 'support@aqarcity.ae'],
      action: isArabic ? 'أرسل بريد' : 'Send Email',
      link: 'mailto:info@aqarcity.ae'
    },
    {
      icon: MapPin,
      title: isArabic ? 'المكتب' : 'Office',
      details: [isArabic ? 'دبي مارينا' : 'Dubai Marina', isArabic ? 'دبي، الإمارات' : 'Dubai, UAE'],
      action: isArabic ? 'احصل على الاتجاهات' : 'Get Directions',
      link: '#'
    },
    {
      icon: Clock,
      title: isArabic ? 'ساعات العمل' : 'Working Hours',
      details: [
        isArabic ? 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً' : 'Mon - Fri: 9:00 AM - 6:00 PM', 
        isArabic ? 'السبت: 9:00 صباحاً - 2:00 مساءً' : 'Sat: 9:00 AM - 2:00 PM'
      ],
      action: isArabic ? 'عرض الجدول' : 'View Schedule',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            {isArabic
              ? 'تواصل مع فريقنا المتخصص. نحن هنا لمساعدتك في جميع احتياجاتك العقارية في الإمارات.'
              : 'Get in touch with our expert team. We\'re here to help you with all your real estate needs in the UAE.'
            }
          </p>
        </div>
      </section>

      {/* Success Message */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold">
                {isArabic ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!'}
              </p>
              <p className="text-green-700 text-sm">
                {isArabic ? 'سنتواصل معك قريباً.' : 'We will get back to you soon.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1 mb-4">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
                <a 
                  href={info.link}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-block hover:underline"
                >
                  {info.action}
                </a>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {isArabic ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {isArabic
                  ? 'لديك سؤال أو تحتاج إلى المساعدة؟ املأ النموذج أدناه وسيعود فريقنا إليك في غضون 24 ساعة.'
                  : 'Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.'
                }
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'الموضوع *' : 'Subject *'}
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="">
                        {isArabic ? 'اختر موضوعاً' : 'Select a subject'}
                      </option>
                      <option value="buying">
                        {isArabic ? 'شراء عقار' : 'Buying Property'}
                      </option>
                      <option value="selling">
                        {isArabic ? 'بيع عقار' : 'Selling Property'}
                      </option>
                      <option value="renting">
                        {isArabic ? 'استئجار عقار' : 'Renting Property'}
                      </option>
                      <option value="investment">
                        {isArabic ? 'استفسار استثماري' : 'Investment Inquiry'}
                      </option>
                      <option value="general">
                        {isArabic ? 'سؤال عام' : 'General Question'}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? 'الرسالة *' : 'Message *'}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder={isArabic ? 'أخبرنا عن متطلباتك أو أسئلتك...' : 'Tell us about your requirements or questions...'}
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  disabled={submitting}
                  loading={submitting}
                  className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse text-lg py-4"
                  size="lg"
                >
                  {!submitting && <Send className="w-5 h-5" />}
                  <span>{submitting ? (isArabic ? 'جاري الإرسال...' : 'Sending...') : (isArabic ? 'إرسال الرسالة' : 'Send Message')}</span>
                </AnimatedButton>
              </form>
            </div>

            {/* Quick Contact */}
            <div className="space-y-6">
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? 'تواصل سريع' : 'Quick Contact'}
                </h3>
                
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/971501234567" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <p className="text-gray-600 text-sm">+971 50 123 4567</p>
                    </div>
                    <div className="text-green-600 font-medium text-sm">
                      {isArabic ? 'محادثة' : 'Chat'}
                    </div>
                  </a>

                  <a 
                    href="tel:+97141234567"
                    className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {isArabic ? 'اتصل بنا' : 'Call Us'}
                      </h4>
                      <p className="text-gray-600 text-sm">+971 4 123 4567</p>
                    </div>
                    <div className="text-blue-600 font-medium text-sm">
                      {isArabic ? 'اتصال' : 'Call'}
                    </div>
                  </a>

                  <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-1">
                          {isArabic ? 'اتصال طارئ' : 'Emergency Contact'}
                        </h4>
                        <p className="text-red-800 text-sm leading-relaxed">
                          {isArabic 
                            ? 'للأمور العقارية العاجلة، اتصل بخطنا الساخن على مدار 24/7:'
                            : 'For urgent property matters, call our 24/7 hotline:'
                          }
                        </p>
                        <a href="tel:+971509998888" className="font-bold text-red-900 text-lg hover:underline">
                          +971 50 999 8888
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {isArabic ? 'موقعنا' : 'Our Location'}
                </h3>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">
                      {isArabic ? 'دبي مارينا، دبي' : 'Dubai Marina, Dubai'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {isArabic ? 'الإمارات العربية المتحدة' : 'United Arab Emirates'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
