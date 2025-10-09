import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, DollarSign, Briefcase, Send, CheckCircle } from 'lucide-react';
import { careersAPI } from '../lib/api';
import { JobCardSkeleton } from '../components/skeletons';

interface Career {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  requirements: string[];
  location: string;
  salary: string;
  jobType: string;
  status: string;
  createdAt: string;
}

export default function Careers() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await careersAPI.getAll();
      setCareers(Array.isArray(response.data) ? response.data.filter((career: Career) => career.status === 'active') : []);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setCareers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (career: Career) => {
    setSelectedCareer(career);
    setShowApplicationForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isArabic ? 'الوظائف المتاحة' : 'Career Opportunities'}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              {isArabic 
                ? 'انضم إلى فريق عقار سيتي الإمارات واكتشف الفرص الوظيفية المثيرة في قطاع العقارات'
                : 'Join Aqar City UAE team and discover exciting career opportunities in real estate'
              }
            </p>
          </div>
        </section>
        
        {/* Loading Skeletons */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isArabic ? 'الوظائف المتاحة' : 'Career Opportunities'}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            {isArabic 
              ? 'انضم إلى فريق عقار سيتي الإمارات واكتشف الفرص الوظيفية المثيرة في قطاع العقارات'
              : 'Join Aqar City UAE team and discover exciting career opportunities in real estate'
            }
          </p>
          <div className="mt-6 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{careers.length} {isArabic ? 'وظيفة متاحة' : 'Available Positions'}</span>
          </div>
        </div>
      </section>

      {/* Careers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {careers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <div key={career.id} className="card hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                          {isArabic ? career.titleAr : career.titleEn}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{career.location}</span>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                        {career.jobType}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {isArabic ? career.descriptionAr : career.descriptionEn}
                    </p>

                    {career.requirements && career.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">
                          {isArabic ? 'المتطلبات:' : 'Requirements:'}
                        </h4>
                        <ul className="space-y-1">
                          {career.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="text-primary-600 mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                          {career.requirements.length > 2 && (
                            <li className="text-xs text-primary-600 font-medium">
                              +{career.requirements.length - 2} {isArabic ? 'المزيد' : 'more'}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                      {career.salary && (
                        <div className="flex items-center text-primary-600 font-semibold">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="text-sm">{career.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{new Date(career.createdAt).toLocaleDateString(isArabic ? 'ar-AE' : 'en-US')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link href={`/careers/${career.id}`} className="flex-1">
                        <button className="w-full btn btn-outline text-sm flex items-center justify-center">
                          {isArabic ? 'عرض التفاصيل' : 'View Details'}
                        </button>
                      </Link>
                      <button
                        onClick={() => handleApply(career)}
                        className="flex-1 btn btn-primary text-sm flex items-center justify-center"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isArabic ? 'تقدم الآن' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {isArabic ? 'لا توجد وظائف متاحة حالياً' : 'No Careers Available Currently'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {isArabic 
                  ? 'نحن نعمل دائماً على توسيع فريقنا. تحقق مرة أخرى قريباً للحصول على فرص جديدة.'
                  : 'We are always looking to expand our team. Check back soon for new opportunities.'
                }
              </p>
              <Link href="/">
                <button className="btn btn-primary">
                  {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationForm && selectedCareer && (
        <ApplicationForm
          career={selectedCareer}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedCareer(null);
          }}
          isArabic={isArabic}
        />
      )}
    </div>
  );
}

interface ApplicationFormProps {
  career: Career;
  onClose: () => void;
  isArabic: boolean;
}

function ApplicationForm({ career, onClose, isArabic }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await careersAPI.apply(career.id, formData);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      alert(isArabic ? 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isArabic ? 'تم إرسال طلبك بنجاح!' : 'Application Submitted!'}
          </h2>
          <p className="text-gray-600">
            {isArabic 
              ? 'شكراً لتقديمك. سنتواصل معك قريباً.'
              : 'Thank you for applying. We will contact you soon.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {isArabic ? 'تقدم للوظيفة' : 'Apply for Position'}
            </h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <h3 className="font-semibold text-lg mb-2 text-primary-900">
              {isArabic ? career.titleAr : career.titleEn}
            </h3>
            <div className="flex items-center text-primary-700 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{career.location}</span>
              <span className="mx-2">•</span>
              <span>{career.jobType}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الاسم الكامل *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'البريد الإلكتروني *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={isArabic ? 'your.email@example.com' : 'your.email@example.com'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+971 50 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'خطاب التغطية (اختياري)' : 'Cover Letter (Optional)'}
              </label>
              <textarea
                rows={5}
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder={isArabic ? 'اكتب خطاب التغطية هنا...' : 'Tell us why you\'re a great fit for this role...'}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 btn btn-outline"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn btn-primary flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isArabic ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {isArabic ? 'إرسال الطلب' : 'Submit Application'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}