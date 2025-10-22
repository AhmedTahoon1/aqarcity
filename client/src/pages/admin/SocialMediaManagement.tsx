import { useTranslation } from 'react-i18next';
import { Share2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import SocialMediaSettings from '../../components/admin/SocialMediaSettings';
import StatisticsManagement from '../../components/admin/StatisticsManagement';
import JobsManagement from '../../components/admin/JobsManagement';
import DefaultAgentSettings from '../../components/admin/DefaultAgentSettings';

export default function SocialMediaManagement() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isArabic = i18n.language === 'ar';

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
          <Share2 className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {isArabic ? 'إدارة وسائل التواصل الاجتماعي' : 'Social Media Management'}
          </h1>
        </div>

        <div className="space-y-6">
          <DefaultAgentSettings />
          <SocialMediaSettings />
          <StatisticsManagement />
          <JobsManagement />
        </div>
      </div>
    </div>
  );
}
