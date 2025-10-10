import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Unsubscribe() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const response = await fetch(`/api/v1/guest-searches/unsubscribe/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'حدث خطأ أثناء إلغاء الاشتراك');
        }
      } catch (error) {
        setStatus('error');
        setMessage('حدث خطأ في الاتصال');
      }
    };

    if (token) {
      unsubscribe();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              جاري إلغاء الاشتراك...
            </h1>
            <p className="text-gray-600">
              يرجى الانتظار بينما نقوم بمعالجة طلبك
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              تم إلغاء الاشتراك بنجاح
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ لن تتلقى المزيد من التنبيهات لهذا البحث المحفوظ
              </p>
            </div>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للموقع الرئيسي
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              فشل في إلغاء الاشتراك
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                ❌ حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً
              </p>
            </div>
            <a
              href="/"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              العودة للموقع الرئيسي
            </a>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © 2024 عقار سيتي الإمارات - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}