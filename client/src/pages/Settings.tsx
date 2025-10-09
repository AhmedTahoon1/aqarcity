import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Bell, Globe, Moon, Sun, Shield, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showPhone: false,
      showEmail: false
    },
    preferences: {
      language: 'en',
      theme: 'light',
      currency: 'AED'
    }
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          language: user.languagePreference || 'en'
        }
      }));
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      setSuccess(isArabic ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isArabic ? 'يجب تسجيل الدخول' : 'Please sign in'}
          </h2>
          <a href="/login" className="btn btn-primary">
            {isArabic ? 'تسجيل الدخول' : 'Sign In'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
          <SettingsIcon className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? 'الإعدادات' : 'Settings'}
          </h1>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <Bell className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isArabic ? 'الإشعارات' : 'Notifications'}
              </h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {isArabic 
                      ? key === 'email' ? 'إشعارات البريد الإلكتروني' 
                        : key === 'push' ? 'الإشعارات الفورية'
                        : key === 'sms' ? 'رسائل SMS'
                        : 'التسويق'
                      : key === 'email' ? 'Email notifications'
                        : key === 'push' ? 'Push notifications'
                        : key === 'sms' ? 'SMS notifications'
                        : 'Marketing emails'
                    }
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isArabic ? 'الخصوصية' : 'Privacy'}
              </h2>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {isArabic 
                      ? key === 'profileVisible' ? 'إظهار الملف الشخصي'
                        : key === 'showPhone' ? 'إظهار رقم الهاتف'
                        : 'إظهار البريد الإلكتروني'
                      : key === 'profileVisible' ? 'Profile visible to others'
                        : key === 'showPhone' ? 'Show phone number'
                        : 'Show email address'
                    }
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isArabic ? 'التفضيلات' : 'Preferences'}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {isArabic ? 'اللغة' : 'Language'}
                </span>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {isArabic ? 'المظهر' : 'Theme'}
                </span>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => updateSetting('preferences', 'theme', 'light')}
                    className={`p-2 rounded-lg ${settings.preferences.theme === 'light' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <Sun className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => updateSetting('preferences', 'theme', 'dark')}
                    className={`p-2 rounded-lg ${settings.preferences.theme === 'dark' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  >
                    <Moon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {isArabic ? 'العملة' : 'Currency'}
                </span>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => updateSetting('preferences', 'currency', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary px-8 py-3"
            >
              {loading 
                ? (isArabic ? 'جاري الحفظ...' : 'Saving...') 
                : (isArabic ? 'حفظ الإعدادات' : 'Save Settings')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}