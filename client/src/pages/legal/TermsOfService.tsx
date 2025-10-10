import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <FileText className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('legal.termsOfService')}
            </h1>
            <p className="text-gray-600">
              {t('legal.lastUpdated')}: {isArabic ? '1 يناير 2024' : 'January 1, 2024'}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <div className="space-y-8">
              {/* Acceptance */}
              <section>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.acceptance')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.acceptanceDesc')}</p>
                  <p>{t('legal.bindingAgreement')}</p>
                </div>
              </section>

              {/* Services */}
              <section>
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.services')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <p>{t('legal.servicesDesc')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('legal.propertyListings')}</li>
                    <li>{t('legal.propertySales')}</li>
                    <li>{t('legal.customerService')}</li>
                    <li>{t('legal.propertyValuation')}</li>
                    <li>{t('legal.legalAssistance')}</li>
                    <li>{t('legal.marketInsights')}</li>
                  </ul>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('legal.userResponsibilities')}
                  </h2>
                </div>
                <div className="text-gray-700 space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('legal.accurateInfo')}</li>
                    <li>{t('legal.respectfulBehavior')}</li>
                    <li>{t('legal.timelyPayments')}</li>
                    <li>{t('legal.propertyInspection')}</li>
                    <li>{t('legal.followLaws')}</li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.ourResponsibility')}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t('legal.ourResponsibilityDesc')}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>{t('legal.accurateListings')}</li>
                  <li>{t('legal.professionalService')}</li>
                  <li>{t('legal.legalCompliance')}</li>
                  <li>{t('legal.customerSatisfaction')}</li>
                </ul>
              </section>

              {/* Contact */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('legal.contactUs')}
                </h2>
                <p className="text-gray-700">
                  {t('legal.questionsContact')}: legal@aqarcity.ae
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}