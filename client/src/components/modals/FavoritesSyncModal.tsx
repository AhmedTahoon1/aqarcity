import { useTranslation } from 'react-i18next';
import { Heart, X, Check, AlertCircle } from 'lucide-react';

interface FavoritesSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  favoritesCount: number;
}

export default function FavoritesSyncModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline, 
  favoritesCount 
}: FavoritesSyncModalProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Heart className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('favorites.syncTitle')}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-start space-x-3 rtl:space-x-reverse mb-4">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700 mb-2">
                  {t('favorites.syncMessage', { count: favoritesCount })}
                </p>
                <p className="text-sm text-gray-500">
                  {t('favorites.syncDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{t('favorites.syncAccept')}</span>
            </button>
            <button
              onClick={onDecline}
              className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>{t('favorites.syncDecline')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}