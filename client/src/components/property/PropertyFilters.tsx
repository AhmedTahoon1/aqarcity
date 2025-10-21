import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, X } from 'lucide-react';
import FeaturesFilter from './FeaturesFilter';
import EmirateAreaFilter from './EmirateAreaFilter';

interface FilterProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

export default function PropertyFilters({ onFiltersChange, initialFilters = {} }: FilterProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [filters, setFilters] = useState({
    emirate: initialFilters.emirate || '',
    area: initialFilters.area || '',
    developer: initialFilters.developer || '',
    status: initialFilters.status || '',
    type: initialFilters.type || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    bedrooms: initialFilters.bedrooms || '',
    bathrooms: initialFilters.bathrooms || '',
    features: initialFilters.features || {
      amenities: [],
      location: [],
      security: []
    },
    ...initialFilters
  });



  const developers = [
    { value: 'Emaar Properties', label: isArabic ? 'إعمار العقارية' : 'Emaar Properties' },
    { value: 'DAMAC Properties', label: isArabic ? 'داماك العقارية' : 'DAMAC Properties' },
    { value: 'Nakheel', label: isArabic ? 'نخيل' : 'Nakheel' },
    { value: 'Dubai Properties', label: isArabic ? 'دبي العقارية' : 'Dubai Properties' },
    { value: 'Meraas', label: isArabic ? 'مراس' : 'Meraas' }
  ];

  const propertyTypes = [
    { value: 'villa', label: isArabic ? 'فيلا' : 'Villa' },
    { value: 'apartment', label: isArabic ? 'شقة' : 'Apartment' },
    { value: 'townhouse', label: isArabic ? 'تاون هاوس' : 'Townhouse' },
    { value: 'penthouse', label: isArabic ? 'بنتهاوس' : 'Penthouse' },
    { value: 'land', label: isArabic ? 'أرض' : 'Land' }
  ];

  const statusOptions = [
    { value: 'sale', label: isArabic ? 'للبيع' : 'For Sale' },
    { value: 'rent', label: isArabic ? 'للإيجار' : 'For Rent' }
  ];

  const bedroomOptions = [
    { value: '0', label: isArabic ? 'استوديو' : 'Studio' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5+' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFeaturesChange = (features: { amenities: string[]; location: string[]; security: string[] }) => {
    const newFilters = { ...filters, features };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      emirate: '',
      area: '',
      developer: '',
      status: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      features: {
        amenities: [],
        location: [],
        security: []
      }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-4">
            {/* Emirate & Area Filter */}
            <EmirateAreaFilter
              selectedEmirate={filters.emirate}
              selectedArea={filters.area}
              onEmirateChange={(emirateId) => handleFilterChange('emirate', emirateId)}
              onAreaChange={(areaId) => handleFilterChange('area', areaId)}
            />

            {/* Developer Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.developer')}
              </label>
              <select
                value={filters.developer}
                onChange={(e) => handleFilterChange('developer', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('filters.allDevelopers')}</option>
                {developers.map(dev => (
                  <option key={dev.value} value={dev.value}>
                    {dev.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.status')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('filters.allStatus')}</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.propertyType')}
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('filters.allTypes')}</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.minPrice')}
              </label>
              <input
                type="number"
                placeholder={t('filters.minPrice')}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.maxPrice')}
              </label>
              <input
                type="number"
                placeholder={t('filters.maxPrice')}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.bedrooms')}
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('filters.anyBedrooms')}</option>
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('filters.bathrooms')}
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t('filters.anyBathrooms')}</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            {/* Features Filter */}
            <FeaturesFilter
              selectedFeatures={filters.features}
              onFeaturesChange={handleFeaturesChange}
            />
            
            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('filters.clearFilters')}
                </button>
              </div>
            )}
      </div>
    </div>
  );
}