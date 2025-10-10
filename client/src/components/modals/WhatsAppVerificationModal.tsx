import React, { useState } from 'react';
import { X, MessageCircle, Loader2 } from 'lucide-react';

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  searchName: string;
  onVerificationSuccess: () => void;
}

export const WhatsAppVerificationModal: React.FC<WhatsAppVerificationModalProps> = ({
  isOpen,
  onClose,
  phone,
  searchName,
  onVerificationSuccess
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('يرجى إدخال رمز التحقق');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/v1/guest-searches/verify-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code: code.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess();
        onClose();
      } else {
        setError(data.error || 'حدث خطأ أثناء التحقق');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/v1/guest-searches/resend-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setCode('');
        // يمكن إضافة رسالة نجاح هنا
      } else {
        setError(data.error || 'حدث خطأ أثناء إعادة الإرسال');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            تأكيد رمز الواتس اب
          </h2>
          <p className="text-gray-600 text-sm">
            تم إرسال رمز التحقق إلى رقم الواتس اب
          </p>
          <p className="text-blue-600 font-medium mt-1 direction-ltr">
            {phone.startsWith('+971') ? phone : '+971' + phone}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رمز التحقق (6 أرقام)
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>البحث المحفوظ:</strong> {searchName}
            </p>
            <p className="text-blue-600 text-xs mt-1">
              الرمز صالح لمدة 10 دقائق فقط
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying || code.length !== 6}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              'تأكيد الرمز'
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              لم تستلم الرمز؟{' '}
              <button 
                onClick={handleResendCode}
                disabled={isResending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isResending ? 'جاري الإرسال...' : 'إعادة الإرسال'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};