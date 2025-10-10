import { useTranslation } from 'react-i18next';
import { Cookie, Settings, Shield, BarChart3 } from 'lucide-react';

export default function CookiePolicy() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Cookie className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('legal.cookiePolicy')}
            </h1>
            <p className="text-gray-600">
              {t('legal.lastUpdated')}: {isArabic ? '1 يناير 2024' : 'January 1, 2024'}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">
              {/* What are Cookies */}
              <section>
                <div className="flex items-center mb-4">
                  <Cookie className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.whatAreCookies')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.cookiesDefinition')}</p>
                  <p>{t('legal.cookiesPurpose')}</p>
                </div>
              </section>

              {/* Types of Cookies */}
              <section>
                <div className="flex items-center mb-4">
                  <Settings className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.typesOfCookies')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-6">
                  {/* Essential Cookies */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {t('legal.essentialCookies')}
                    </h3>
                    <p className="text-blue-800 text-sm mb-2">
                      {t('legal.essentialCookiesDesc')}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm ml-4">
                      <li>{t('legal.sessionManagement')}</li>
                      <li>{t('legal.securityFeatures')}</li>
                      <li>{t('legal.languagePreferences')}</li>
                    </ul>
                  </div>

                  {/* Performance Cookies */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">
                      {t('legal.performanceCookies')}
                    </h3>
                    <p className="text-green-800 text-sm mb-2">
                      {t('legal.performanceCookiesDesc')}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-green-800 text-sm ml-4">
                      <li>{t('legal.pageLoadTimes')}</li>
                      <li>{t('legal.userBehavior')}</li>
                      <li>{t('legal.errorTracking')}</li>
                    </ul>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      {t('legal.marketingCookies')}
                    </h3>
                    <p className="text-purple-800 text-sm mb-2">
                      {t('legal.marketingCookiesDesc')}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm ml-4">
                      <li>{t('legal.personalizedAds')}</li>
                      <li>{t('legal.socialMediaIntegration')}</li>
                      <li>{t('legal.propertyRecommendations')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Cookie Management */}
              <section>
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.cookieManagement')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.cookieControl')}</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t('legal.browserSettings')}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                      <li><strong>Chrome:</strong> {t('legal.chromeInstructions')}</li>
                      <li><strong>Firefox:</strong> {t('legal.firefoxInstructions')}</li>
                      <li><strong>Safari:</strong> {t('legal.safariInstructions')}</li>
                      <li><strong>Edge:</strong> {t('legal.edgeInstructions')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Third Party Cookies */}
              <section>
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.thirdPartyCookies')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.thirdPartyCookiesDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> {t('legal.googleAnalytics')}</li>
                    <li><strong>Facebook Pixel:</strong> {t('legal.facebookPixel')}</li>
                    <li><strong>Google Maps:</strong> {t('legal.googleMaps')}</li>
                  </ul>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.contactUs')}
                </h2>
                <p className="text-gray-700">
                  {t('legal.cookieQuestions')}: privacy@aqarcity.ae
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}