import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Users } from 'lucide-react';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('legal.privacyPolicy')}
            </h1>
            <p className="text-gray-600">
              {t('legal.lastUpdated')}: {isArabic ? '1 يناير 2024' : 'January 1, 2024'}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">
              {/* Information We Collect */}
              <section>
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.informationWeCollect')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.personalInfo')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('legal.nameEmail')}</li>
                    <li>{t('legal.phoneAddress')}</li>
                    <li>{t('legal.propertyPreferences')}</li>
                    <li>{t('legal.searchHistory')}</li>
                    <li>{t('legal.financialInfo')}</li>
                    <li>{t('legal.communicationHistory')}</li>
                  </ul>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.howWeUseInfo')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('legal.provideServices')}</li>
                    <li>{t('legal.processTransactions')}</li>
                    <li>{t('legal.customerSupport')}</li>
                    <li>{t('legal.marketingCommunication')}</li>
                    <li>{t('legal.legalCompliance')}</li>
                    <li>{t('legal.improveExperience')}</li>
                  </ul>
                </div>
              </section>

              {/* Data Protection */}
              <section>
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.dataProtection')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.dataProtectionDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                    <li>{t('legal.secureServers')}</li>
                    <li>{t('legal.encryptedTransmission')}</li>
                    <li>{t('legal.accessControls')}</li>
                    <li>{t('legal.regularAudits')}</li>
                  </ul>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.contactUs')}
                </h2>
                <p className="text-gray-700">
                  {t('legal.questionsContact')}: privacy@aqarcity.ae
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}