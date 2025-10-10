import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { guestSearchesAPI } from '@/lib/api';
import { X, Bookmark, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { WhatsAppVerificationModal } from './WhatsAppVerificationModal';

interface GuestSaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchCriteria: any;
}

export default function GuestSaveSearchModal({ isOpen, onClose, searchCriteria }: GuestSaveSearchModalProps) {
  const [step, setStep] = useState(1); // 1: بيانات، 2: تحقق، 3: تحقق واتساب
  const [contactType, setContactType] = useState<'email' | 'whatsapp'>('email');
  const [contactValue, setContactValue] = useState('');
  const [name, setName] = useState('');
  const [alertsEnabled] = useState(true); // مفعل تلقائياً للضيوف
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [showWhatsAppVerification, setShowWhatsAppVerification] = useState(false);

  const createSearchMutation = useMutation({
    mutationFn: guestSearchesAPI.create,
    onSuccess: (data) => {
      if (contactType === 'whatsapp') {
        setShowWhatsAppVerification(true);
      } else {
        setStep(2);
      }
    },
    onError: (error: any) => {
      alert('حدث خطأ: ' + (error.response?.data?.error || error.message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // إضافة كود الإمارات لرقم الواتساب
    let finalContactValue = contactValue;
    if (contactType === 'whatsapp') {
      finalContactValue = '+971' + contactValue;
    }
    
    createSearchMutation.mutate({
      contactType,
      contactValue: finalContactValue,
      name,
      searchCriteria,
      alertsEnabled,
      alertFrequency,
    });
  };

  const handleClose = () => {
    setStep(1);
    setContactValue('');
    setName('');
    setShowWhatsAppVerification(false);
    onClose();
  };

  const handleWhatsAppVerificationSuccess = () => {
    setShowWhatsAppVerification(false);
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {step === 1 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-primary-600" />
                <span>حفظ البحث</span>
              </h3>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 احفظ بحثك واحصل على تنبيهات فورية عند إضافة عقارات جديدة تطابق اهتماماتك!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم البحث *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: شقق 3 غرف في دبي مارينا"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  طريقة التواصل *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    contactType === 'email' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="email"
                      checked={contactType === 'email'}
                      onChange={(e) => setContactType(e.target.value as 'email')}
                      className="sr-only"
                    />
                    <Mail className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="text-sm font-medium">الإيميل</span>
                  </label>
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    contactType === 'whatsapp' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="whatsapp"
                      checked={contactType === 'whatsapp'}
                      onChange={(e) => setContactType(e.target.value as 'whatsapp')}
                      className="sr-only"
                    />
                    <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">الواتساب</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactType === 'email' ? 'البريد الإلكتروني *' : 'رقم الواتساب *'}
                </label>
                {contactType === 'whatsapp' ? (
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      +971
                    </span>
                    <input
                      type="tel"
                      value={contactValue}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setContactValue(value);
                      }}
                      placeholder="501234567"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      maxLength={9}
                      required
                    />
                  </div>
                ) : (
                  <input
                    type="email"
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                )}
              </div>

              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-800">تفعيل التنبيهات تلقائياً</span>
                    <p className="text-xs text-blue-600 mt-1">
                      ستتلقى تنبيهات فورية عند توفر عقارات جديدة. يمكنك إلغاء الاشتراك في أي وقت.
                    </p>
                  </div>
                </div>
              </div>

              {alertsEnabled && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تكرار التنبيهات
                  </label>
                  <select
                    value={alertFrequency}
                    onChange={(e) => setAlertFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="instant">فوري</option>
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                  </select>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createSearchMutation.isPending}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {createSearchMutation.isPending ? 'جاري الحفظ...' : 'حفظ البحث'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold mb-4">تم إرسال رسالة التحقق!</h3>
            
            <div className="text-right mb-6 space-y-3">
              {contactType === 'email' ? (
                <>
                  <p className="text-gray-600">
                    📧 تم إرسال رسالة تحقق إلى بريدك الإلكتروني:
                  </p>
                  <p className="font-medium text-primary-600">{contactValue}</p>
                  <p className="text-sm text-gray-500">
                    تحقق من صندوق الوارد (وصندوق الرسائل غير المرغوب فيها) واضغط على الرابط لتفعيل البحث.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    ✅ تم تفعيل البحث بنجاح!
                  </p>
                  <p className="font-medium text-green-600">{contactValue}</p>
                  <p className="text-sm text-gray-500">
                    ستبدأ في تلقي تنبيهات فورية عند توفر عقارات جديدة.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    🚫 يمكنك إيقاف التنبيهات في أي وقت من رابط إلغاء الاشتراك
                  </p>
                </>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⏰ رسالة التحقق صالحة لمدة 24 ساعة فقط
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              حسناً
            </button>
          </div>
        )}
        
        <WhatsAppVerificationModal
          isOpen={showWhatsAppVerification}
          onClose={() => setShowWhatsAppVerification(false)}
          phone={contactValue}
          searchName={name}
          onVerificationSuccess={handleWhatsAppVerificationSuccess}
        />
      </div>
    </div>
  );
}