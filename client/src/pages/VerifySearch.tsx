import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { guestSearchesAPI } from '@/lib/api';
import { CheckCircle, XCircle, Loader2, Search, Bell } from 'lucide-react';

export default function VerifySearch() {
  const { token } = useParams<{ token: string }>();
  const [, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  // جلب معاينة البحث
  const { data: searchPreview } = useQuery({
    queryKey: ['search-preview', token],
    queryFn: () => guestSearchesAPI.preview(token!),
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setMessage('رمز التحقق غير صحيح');
      return;
    }

    const verifySearch = async () => {
      try {
        const response = await guestSearchesAPI.verify(token);
        setVerificationStatus('success');
        setMessage(response.data.message);
      } catch (error: any) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.error || 'حدث خطأ أثناء التحقق');
      }
    };

    verifySearch();
  }, [token]);

  const handleGoToProperties = () => {
    setLocation('/properties');
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {verificationStatus === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">جاري التحقق...</h2>
              <p className="text-gray-600">يرجى الانتظار بينما نتحقق من البحث المحفوظ</p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التحقق بنجاح! 🎉</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              {searchPreview?.data && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 text-right">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Search className="w-5 h-5 text-primary-600" />
                    <h3 className="font-medium text-gray-900">{searchPreview.data.name}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <Bell className={`w-4 h-4 ${searchPreview.data.alertsEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span>
                        {searchPreview.data.alertsEnabled 
                          ? `التنبيهات مفعلة (${searchPreview.data.alertFrequency})`
                          : 'التنبيهات معطلة'
                        }
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      تم الإنشاء في {new Date(searchPreview.data.createdAt).toLocaleDateString('ar')}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔔 ستبدأ في تلقي التنبيهات عند إضافة عقارات جديدة تطابق معايير البحث الخاصة بك.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoToProperties}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  تصفح العقارات الآن
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  العودة للرئيسية
                </button>
              </div>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">فشل التحقق</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  💡 تأكد من أن الرابط صحيح وأنه لم تنته صلاحيته (24 ساعة من وقت الإرسال)
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoToProperties}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  إنشاء بحث جديد
                </button>
                <button
                  onClick={handleGoHome}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  العودة للرئيسية
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}