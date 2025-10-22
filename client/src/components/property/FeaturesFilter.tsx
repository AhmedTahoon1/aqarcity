import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { featuresAPI } from '@/lib/api';
import { PROPERTY_FEATURES } from '../../data/property-features';
import { Home, MapPin, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface FeaturesFilterProps {
  selectedFeatures: {
    amenities: string[];
    location: string[];
    security: string[];
  };
  onFeaturesChange: (features: {
    amenities: string[];
    location: string[];
    security: string[];
  }) => void;
}

export default function FeaturesFilter({ selectedFeatures, onFeaturesChange }: FeaturesFilterProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [features, setFeatures] = useState(PROPERTY_FEATURES);

  // Fetch features from API
  const { data: apiFeatures } = useQuery({
    queryKey: ['features'],
    queryFn: () => featuresAPI.getAll().then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (apiFeatures) {
      setFeatures(apiFeatures);
    }
  }, [apiFeatures]);

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
      titleEn: 'Location Features',
      titleAr: 'مميزات الموقع',
      color: 'green'
    },
    {
      key: 'security' as const,
      icon: Shield,
      titleEn: 'Security Features',
      titleAr: 'مميزات الأمان',
      color: 'red'
    }
  ];

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey)
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleFeatureToggle = (category: keyof typeof selectedFeatures, featureId: string) => {
    const currentFeatures = selectedFeatures[category];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];

    onFeaturesChange({
      ...selectedFeatures,
      [category]: newFeatures
    });
  };

  const getColorClasses = (color: string, selected: boolean) => {
    const colors = {
      blue: selected 
        ? 'bg-blue-100 border-blue-300 text-blue-800' 
        : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50',
      green: selected 
        ? 'bg-green-100 border-green-300 text-green-800' 
        : 'bg-white border-gray-200 text-gray-700 hover:bg-green-50',
      red: selected 
        ? 'bg-red-100 border-red-300 text-red-800' 
        : 'bg-white border-gray-200 text-gray-700 hover:bg-red-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        {isArabic ? 'المرافق والمميزات' : 'Features & Amenities'}
      </h3>
      
      {categories.map(category => {
        const Icon = category.icon;
        const isExpanded = expandedSections.includes(category.key);
        const categoryFeatures = features[category.key];
        const selectedCount = selectedFeatures[category.key].length;

        return (
          <div key={category.key} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(category.key)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="font-medium">
                  {isArabic ? category.titleAr : category.titleEn}
                </span>
                {selectedCount > 0 && (
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                    {selectedCount}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {isExpanded && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryFeatures.map(feature => {
                    const isSelected = selectedFeatures[category.key].includes(feature.id);
                    
                    return (
                      <label
                        key={feature.id}
                        className={`flex items-center p-2 rounded border cursor-pointer transition-colors ${getColorClasses(category.color, isSelected)}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFeatureToggle(category.key, feature.id)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 mr-2 rtl:mr-0 rtl:ml-2 flex items-center justify-center ${
                          isSelected ? 'bg-current border-current' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">
                          {isArabic ? feature.nameAr : feature.nameEn}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}