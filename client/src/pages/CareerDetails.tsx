import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, DollarSign, Briefcase, CheckCircle, Send, User, Mail, Phone } from 'lucide-react';
import { careersAPI } from '../lib/api';

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

export default function CareerDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchCareer();
  }, [id]);

  const fetchCareer = async () => {
    try {
      const response = await careersAPI.getById(id!);
      setCareer(response.data);
    } catch (error) {
      console.error('Error fetching career:', error);
      setCareer({
        id: id || '1',
        titleEn: 'Real Estate Agent',
        titleAr: 'وكيل عقاري',
        descriptionEn: 'Join our dynamic team as a real estate agent in Dubai. Help clients buy, sell, and rent properties while building your career in the thriving UAE real estate market.',
        descriptionAr: 'انضم إلى فريقنا الديناميكي كوكيل عقاري في دبي. ساعد العملاء في شراء وبيع وتأجير العقارات أثناء بناء مسيرتك المهنية في سوق العقارات المزدهر في دولة الإمارات.',
        requirements: ['RERA License required', '2+ years experience in real estate', 'English & Arabic fluency', 'Strong communication skills', 'UAE driving license'],
        location: 'Dubai',
        salary: '8,000 - 15,000 AED',
        jobType: 'Full-time',
        status: 'active',
        createdAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Not Found</h2>
          <p className="text-gray-600">The career opportunity you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Career Header */}
          <div className="card p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {isArabic ? career.titleAr : career.titleEn}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{career.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    <span>{career.jobType}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span>{career.salary}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{new Date(career.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                {isArabic ? 'متاح' : 'Active'}
              </div>
            </div>

            <button
              onClick={() => setShowApplicationForm(true)}
              className="btn btn-primary flex items-center"
            >
              <Send className="w-5 h-5 mr-2" />
              {isArabic ? 'تقدم للوظيفة' : 'Apply Now'}
            </button>
          </div>

          {/* Career Description */}
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isArabic ? 'وصف الوظيفة' : 'Job Description'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isArabic ? career.descriptionAr : career.descriptionEn}
            </p>
          </div>

          {/* Requirements */}
          {career.requirements && career.requirements.length > 0 && (
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isArabic ? 'المتطلبات' : 'Requirements'}
              </h2>
              <ul className="space-y-3">
                {career.requirements.map((req, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationForm && (
        <ApplicationForm
          career={career}
          onClose={() => setShowApplicationForm(false)}
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