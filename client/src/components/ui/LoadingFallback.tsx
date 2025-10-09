import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LoadingFallback() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="text-sm text-gray-600">{t('common.loading')}</p>
      </div>
    </div>
  );
}