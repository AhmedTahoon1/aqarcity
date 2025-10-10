import { useTranslation } from 'react-i18next';
import { AlertCircle, Info, ExternalLink } from 'lucide-react';

export default function Disclaimer() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('legal.disclaimer')}
            </h1>
            <p className="text-gray-600">
              {t('legal.lastUpdated')}: {isArabic ? '1 يناير 2024' : 'January 1, 2024'}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">
              {/* General Disclaimer */}
              <section>
                <div className="flex items-center mb-4">
                  <Info className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.generalDisclaimer')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.generalDisclaimerDesc')}</p>
                  <p>{t('legal.qualityCommitment')}</p>
                </div>
              </section>

              {/* Property Information */}
              <section>
                <div className="flex items-center mb-4">
                  <ExternalLink className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.propertyInformation')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.propertyInfoDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('legal.verifiedInformation')}</li>
                    <li>{t('legal.regularUpdates')}</li>
                    <li>{t('legal.professionalPhotography')}</li>
                    <li>{t('legal.accurateMeasurements')}</li>
                  </ul>
                  <p className="mt-4 text-sm">{t('legal.informationAccuracy')}</p>
                </div>
              </section>

              {/* Investment Advice */}
              <section className="bg-green-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 text-green-900">
                  {t('legal.professionalGuidance')}
                </h2>
                <p className="text-green-800">
                  {t('legal.professionalGuidanceDesc')}
                </p>
              </section>

              {/* Third Party Links */}
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.thirdPartyLinks')}
                </h2>
                <p className="text-gray-700">
                  {t('legal.thirdPartyLinksDesc')}
                </p>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.contactUs')}
                </h2>
                <p className="text-gray-700">
                  {t('legal.questionsContact')}: info@aqarcity.ae
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}