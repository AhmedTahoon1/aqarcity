import { useTranslation } from 'react-i18next';
import { PROPERTY_FEATURES, getFeatureName } from '../../data/property-features';
import { Home, MapPin, Shield } from 'lucide-react';

interface PropertyFeaturesProps {
  features: {
    amenities: string[];
    location: string[];
    security: string[];
  };
  compact?: boolean;
}

export default function PropertyFeatures({ features, compact = false }: PropertyFeaturesProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const categories = [
    {
      key: 'amenities' as const,
      icon: Home,
      titleEn: 'Amenities',
      titleAr: 'المرافق',
      color: 'blue'
    },
    {
      key: 'location' as const,
      icon: MapPin,
      titleEn: 'Location',
      titleAr: 'الموقع',
      color: 'green'
    },
    {
      key: 'security' as const,
      icon: Shield,
      titleEn: 'Security',
      titleAr: 'الأمان',
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (compact) {
    const allFeatures = [
      ...features.amenities,
      ...features.location,
      ...features.security
    ];

    if (allFeatures.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1">
        {allFeatures.slice(0, 3).map((featureId, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {getFeatureName(featureId, isArabic ? 'ar' : 'en')}
          </span>
        ))}
        {allFeatures.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
            +{allFeatures.length - 3}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryFeatures = features[category.key] || [];
        if (categoryFeatures.length === 0) return null;

        const Icon = category.icon;

        return (
          <div key={category.key} className="space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Icon className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                {isArabic ? category.titleAr : category.titleEn}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categoryFeatures.map((featureId, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded border ${getColorClasses(category.color)}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2 rtl:mr-0 rtl:ml-2"></div>
                  <span className="text-sm font-medium">
                    {getFeatureName(featureId, isArabic ? 'ar' : 'en')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}