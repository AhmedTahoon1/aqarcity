import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Building, Users, Award, Target, Heart, Shield, TrendingUp } from 'lucide-react';
import { analyticsAPI, propertiesAPI, agentsAPI } from '../lib/api';

export default function About() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [stats, setStats] = useState({
    properties: 0,
    agents: 0,
    rating: 4.8,
    focus: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [marketData, propertiesData, agentsData] = await Promise.all([
        analyticsAPI.getMarket().catch(() => ({ data: null })),
        propertiesAPI.getAll().catch(() => ({ data: [] })),
        agentsAPI.getAll().catch(() => ({ data: [] }))
      ]);

      setStats({
        properties: Array.isArray(propertiesData.data) ? propertiesData.data.length : 0,
        agents: Array.isArray(agentsData.data) ? agentsData.data.length : 0,
        rating: 4.8,
        focus: 100
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayStats = [
    { 
      icon: Building, 
      value: loading ? '...' : `${stats.properties}+`, 
      label: isArabic ? 'عقار مدرج' : 'Properties Listed' 
    },
    { 
      icon: Users, 
      value: loading ? '...' : `${stats.agents}+`, 
      label: isArabic ? 'وكيل معتمد' : 'Verified Agents' 
    },
    { 
      icon: Award, 
      value: stats.rating, 
      label: isArabic ? 'تقييم العملاء' : 'Customer Rating' 
    },
    { 
      icon: Target, 
      value: `${stats.focus}%`, 
      label: isArabic ? 'تركيز على الإمارات' : 'UAE Focused' 
    },
  ];

  const values = [
    {
      icon: Heart,
      title: isArabic ? 'العميل أولاً' : 'Customer First',
      description: isArabic 
        ? 'نعطي الأولوية لاحتياجات ورضا عملائنا قبل كل شيء.'
        : 'We prioritize our customers needs and satisfaction above everything else.'
    },
    {
      icon: Shield,
      title: isArabic ? 'الثقة والشفافية' : 'Trust & Transparency',
      description: isArabic
        ? 'شفافية كاملة في جميع المعاملات مع معلومات العقارات المعتمدة.'
        : 'Complete transparency in all transactions with verified property information.'
    },
    {
      icon: Award,
      title: isArabic ? 'التميز' : 'Excellence',
      description: isArabic
        ? 'ملتزمون بتقديم خدمة استثنائية وحلول عقارية متميزة.'
        : 'Committed to delivering exceptional service and premium property solutions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {isArabic ? 'عن عقار سيتي الإمارات' : 'About Aqar City UAE'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            {isArabic
              ? 'شريكك الموثوق في إيجاد العقار المثالي في الإمارات. نربط الأحلام بالواقع من خلال حلول عقارية متميزة.'
              : 'Your trusted partner in finding the perfect property in the UAE. We connect dreams with reality through premium real estate solutions.'
            }
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {isArabic ? 'قصتنا' : 'Our Story'}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {isArabic
                    ? 'تأسست عقار سيتي الإمارات برؤية لإحداث ثورة في سوق العقارات في الإمارات، لتصبح اسماً موثوقاً في حلول العقارات. نحن نفهم أن شراء أو بيع عقار هو أحد أهم القرارات في الحياة.'
                    : 'Founded with a vision to revolutionize the UAE real estate market, Aqar City UAE has become a trusted name in property solutions. We understand that buying or selling a property is one of life\'s most important decisions.'
                  }
                </p>
                <p>
                  {isArabic
                    ? 'تجمع منصتنا بين التكنولوجيا المتطورة والمعرفة العميقة بالسوق المحلي لتزويدك بمعلومات دقيقة ومحدثة عن العقارات في دبي والإمارات.'
                    : 'Our platform combines cutting-edge technology with deep local market knowledge to provide you with accurate, up-to-date information about properties across Dubai and the UAE.'
                  }
                </p>
                <p>
                  {isArabic
                    ? 'مع فريقنا من الوكلاء المعتمدين وقاعدة البيانات الشاملة للعقارات، نجعل رحلتك العقارية سلسة وشفافة وناجحة.'
                    : 'With our team of certified agents and comprehensive property database, we make your property journey smooth, transparent, and successful.'
                  }
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 flex flex-col justify-center">
                <TrendingUp className="w-10 h-10 text-primary-600 mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stats.properties}+
                </h3>
                <p className="text-sm text-gray-600">
                  {isArabic ? 'عقار نشط' : 'Active Properties'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex flex-col justify-center">
                <Users className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stats.agents}+
                </h3>
                <p className="text-sm text-gray-600">
                  {isArabic ? 'وكيل خبير' : 'Expert Agents'}
                </p>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isArabic ? 'مهمتنا' : 'Our Mission'}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {isArabic
                      ? 'جعل معاملات العقارات في الإمارات بسيطة وشفافة وسهلة الوصول للجميع من خلال التكنولوجيا المبتكرة والخدمة الاستثنائية.'
                      : 'To make property transactions in the UAE simple, transparent, and accessible for everyone through innovative technology and exceptional service.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isArabic ? 'قيمنا' : 'Our Values'}
            </h2>
            <p className="text-xl text-gray-600">
              {isArabic ? 'المبادئ التي توجه كل ما نقوم به' : 'The principles that guide everything we do'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isArabic ? 'هل أنت مستعد لبدء رحلتك العقارية؟' : 'Ready to Start Your Property Journey?'}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {isArabic 
              ? 'دع فريقنا المتخصص يساعدك في العثور على العقار المثالي في الإمارات'
              : 'Let our expert team help you find your perfect property in the UAE'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <button className="btn bg-white text-primary-600 hover:bg-gray-100 px-8">
                {isArabic ? 'تصفح العقارات' : 'Browse Properties'}
              </button>
            </Link>
            <Link href="/contact">
              <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8">
                {isArabic ? 'اتصل بنا' : 'Contact Us'}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
