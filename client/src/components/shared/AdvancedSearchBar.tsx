import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Building2, DollarSign, ChevronDown, MapPin, Bed, Bath, X, Building, Home } from 'lucide-react';
import { LocationSelect } from '@/components/ui/LocationSelect';

interface SearchBarProps {
  onSearch: (filters: any) => void;
  className?: string;
}

export default function AdvancedSearchBar({ onSearch, className = '' }: SearchBarProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    status: ''
  });

  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);
  const [showBathroomsDropdown, setShowBathroomsDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  
  const bedroomsRef = useRef<HTMLDivElement>(null);
  const bathroomsRef = useRef<HTMLDivElement>(null);
  const propertyTypeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bedroomsRef.current && !bedroomsRef.current.contains(event.target as Node)) {
        setShowBedroomsDropdown(false);
      }
      if (bathroomsRef.current && !bathroomsRef.current.contains(event.target as Node)) {
        setShowBathroomsDropdown(false);
      }
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(event.target as Node)) {
        setShowPropertyTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Map the filter names to match the expected API parameters
    const mappedFilters = {
      location: filters.location,
      type: filters.propertyType,
      status: filters.status,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice
    };
    onSearch(mappedFilters);
  }, [filters, onSearch]);

  const propertyTypes = [
    { value: '', label: isArabic ? 'جميع الأنواع' : 'All Types', icon: Building },
    { value: 'villa', label: isArabic ? 'فيلا' : 'Villa', icon: Home },
    { value: 'apartment', label: isArabic ? 'شقة' : 'Apartment', icon: Building2 },
    { value: 'townhouse', label: isArabic ? 'تاون هاوس' : 'Townhouse', icon: Building },
    { value: 'penthouse', label: isArabic ? 'بنتهاوس' : 'Penthouse', icon: Building2 },
  ];

  const bedroomOptions = [
    { value: '', label: isArabic ? 'أي عدد' : 'Any', icon: Building },
    { value: '0', label: isArabic ? 'استوديو' : 'Studio', icon: Bed },
    { value: '1', label: '1', icon: Bed },
    { value: '2', label: '2', icon: Bed },
    { value: '3', label: '3', icon: Bed },
    { value: '4', label: '4', icon: Bed },
    { value: '5', label: '5+', icon: Bed },
  ];

  const bathroomOptions = [
    { value: '', label: isArabic ? 'أي عدد' : 'Any', icon: Building },
    { value: '1', label: '1', icon: Bath },
    { value: '2', label: '2', icon: Bath },
    { value: '3', label: '3', icon: Bath },
    { value: '4', label: '4+', icon: Bath },
  ];

  const selectedPropertyType = propertyTypes.find(type => type.value === filters.propertyType);
  const selectedBedrooms = bedroomOptions.find(opt => opt.value === filters.bedrooms);
  const selectedBathrooms = bathroomOptions.find(opt => opt.value === filters.bathrooms);

  return (
    <div className={`relative ${className}`}>
      {/* Modern Glass Card */}
      <div className="backdrop-blur-xl bg-white/95 border border-white/20 rounded-3xl shadow-2xl p-8">
        <form onSubmit={handleSubmit}>
          {/* Main Search Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
            
            {/* Location - Takes 2 columns */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                {isArabic ? 'الموقع' : 'Location'}
              </label>
              <LocationSelect
                value={filters.location}
                onChange={(locationId) => setFilters({ ...filters, location: locationId || '' })}
                placeholder={isArabic ? 'اختر الموقع...' : 'Choose location...'}
              />
            </div>

            {/* Property Type */}
            <div className="relative" ref={propertyTypeRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Home className="w-4 h-4 mr-2 text-primary-500" />
                {isArabic ? 'نوع العقار' : 'Property Type'}
              </label>
              <button
                type="button"
                onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  {selectedPropertyType?.icon && <selectedPropertyType.icon className="w-4 h-4 mr-2 text-gray-500" />}
                  <span className="text-gray-700 font-medium">{selectedPropertyType?.label || (isArabic ? 'اختر النوع' : 'Select Type')}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showPropertyTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPropertyTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="py-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, propertyType: type.value });
                          setShowPropertyTypeDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-primary-50 transition-colors flex items-center group"
                      >
                        <type.icon className="w-4 h-4 mr-3 text-gray-500" />
                        <span className="text-gray-700 group-hover:text-primary-600 font-medium">{type.label}</span>
                        {filters.propertyType === type.value && (
                          <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bedrooms */}
            <div className="relative" ref={bedroomsRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Bed className="w-4 h-4 mr-2 text-primary-500" />
                {isArabic ? 'غرف النوم' : 'Bedrooms'}
              </label>
              <button
                type="button"
                onClick={() => setShowBedroomsDropdown(!showBedroomsDropdown)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 font-medium">{selectedBedrooms?.label || (isArabic ? 'اختر العدد' : 'Select')}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showBedroomsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showBedroomsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-4">{isArabic ? 'عدد غرف النوم' : 'Bedrooms'}</div>
                    <div className="flex flex-wrap gap-2">
                      {bedroomOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, bedrooms: option.value });
                            setShowBedroomsDropdown(false);
                          }}
                          className={`w-10 h-10 rounded-full border-2 font-medium text-xs transition-all duration-200 ${
                            filters.bedrooms === option.value
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {option.value === '0' ? 'S' : option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bathrooms */}
            <div className="relative" ref={bathroomsRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Bath className="w-4 h-4 mr-2 text-primary-500" />
                {isArabic ? 'الحمامات' : 'Bathrooms'}
              </label>
              <button
                type="button"
                onClick={() => setShowBathroomsDropdown(!showBathroomsDropdown)}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-700 font-medium">{selectedBathrooms?.label || (isArabic ? 'اختر العدد' : 'Select')}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showBathroomsDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showBathroomsDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-600 mb-4">{isArabic ? 'عدد الحمامات' : 'Bathrooms'}</div>
                    <div className="flex flex-wrap gap-2">
                      {bathroomOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, bathrooms: option.value });
                            setShowBathroomsDropdown(false);
                          }}
                          className={`w-10 h-10 rounded-full border-2 font-medium text-xs transition-all duration-200 ${
                            filters.bathrooms === option.value
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-primary-500" />
                {isArabic ? 'السعر' : 'Price Range'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder={isArabic ? 'أقل سعر' : 'Min'}
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full px-3 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
                />
                <input
                  type="number"
                  placeholder={isArabic ? 'أعلى سعر' : 'Max'}
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-3 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Status Toggle & Search Button */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Enhanced Status Toggle */}
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-700 mr-4">{isArabic ? 'نوع الإعلان:' : 'Listing Type:'}</span>
              <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, status: 'sale' })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filters.status === 'sale'
                      ? 'bg-white text-primary-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {isArabic ? 'للبيع' : 'For Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, status: 'rent' })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filters.status === 'rent'
                      ? 'bg-white text-primary-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {isArabic ? 'للإيجار' : 'For Rent'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, status: '' })}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filters.status === ''
                      ? 'bg-white text-primary-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {isArabic ? 'كلاهما' : 'Both'}
                </button>
              </div>
            </div>

            {/* Premium Search Button */}
            <button
              type="submit"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg">{isArabic ? 'ابحث الآن' : 'Search Now'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-200/30 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-300/20 rounded-full blur-xl"></div>
    </div>
  );
}