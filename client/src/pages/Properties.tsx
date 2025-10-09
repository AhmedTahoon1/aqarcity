import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { propertiesAPI } from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyListSkeleton } from '@/components/skeletons';
import { StaggeredList, AnimatedContainer } from '@/components/animations';
import { Grid, List, ChevronLeft, ChevronRight, AlertCircle, X } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Properties() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const isArabic = i18n.language === 'ar';

  const cities = [
    { value: 'Dubai', label: isArabic ? 'دبي' : 'Dubai' },
    { value: 'Abu Dhabi', label: isArabic ? 'أبو ظبي' : 'Abu Dhabi' },
    { value: 'Sharjah', label: isArabic ? 'الشارقة' : 'Sharjah' },
    { value: 'Ajman', label: isArabic ? 'عجمان' : 'Ajman' },
    { value: 'Ras Al Khaimah', label: isArabic ? 'رأس الخيمة' : 'Ras Al Khaimah' },
  ];

  const propertyTypes = [
    { value: 'villa', label: isArabic ? 'فيلا' : 'Villa' },
    { value: 'apartment', label: isArabic ? 'شقة' : 'Apartment' },
    { value: 'townhouse', label: isArabic ? 'تاون هاوس' : 'Townhouse' },
    { value: 'penthouse', label: isArabic ? 'بنتهاوس' : 'Penthouse' },
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
    { value: '4', label: '4+' },
  ];

  // Read filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: any = {};
    
    if (params.get('city')) urlFilters.city = params.get('city');
    if (params.get('type')) urlFilters.type = params.get('type');
    if (params.get('status')) urlFilters.status = params.get('status');
    if (params.get('minPrice')) urlFilters.minPrice = params.get('minPrice');
    if (params.get('maxPrice')) urlFilters.maxPrice = params.get('maxPrice');
    if (params.get('bedrooms')) urlFilters.bedrooms = params.get('bedrooms');
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [location]);

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties', filters, currentPage, sortBy],
    queryFn: () => propertiesAPI.getAll({ ...filters, page: currentPage, limit: 12, sort: sortBy }),
  });

  const processedProperties = useMemo(() => {
    if (!propertiesData?.data?.properties) return [];
    return propertiesData.data.properties;
  }, [propertiesData]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('nav.properties')}
          </h1>
          <p className="text-gray-600">
            {isArabic ? 'تصفح أفضل العقارات في الإمارات' : 'Browse the best properties in UAE'}
          </p>
        </div>

        {/* Horizontal Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.city')}
              </label>
              <select
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t('filters.allCities')}</option>
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.propertyType')}
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t('filters.allTypes')}</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.status')}
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t('filters.allStatus')}</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.bedrooms')}
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t('filters.anyBedrooms')}</option>
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.minPrice')}
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.maxPrice')}
              </label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{t('filters.clearFilters')}</span>
              </button>
            </div>
          )}
        </div>

        {/* View Toggle & Sort */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="text-sm text-gray-600">
            {propertiesData?.data?.pagination?.total || 0} {isArabic ? 'عقار' : 'properties'}
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">{isArabic ? 'الأحدث' : 'Newest'}</option>
              <option value="oldest">{isArabic ? 'الأقدم' : 'Oldest'}</option>
              <option value="price_asc">{isArabic ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price_desc">{isArabic ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <PropertyListSkeleton count={12} viewMode={viewMode} />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              {isArabic ? 'خطأ في التحميل' : 'Loading Failed'}
            </h3>
            <p className="text-red-700 mb-4">
              {isArabic ? 'حاول مرة أخرى' : 'Please try again'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : (!processedProperties || processedProperties.length === 0) ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isArabic ? 'لا توجد عقارات' : 'No Properties Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isArabic ? 'جرب تعديل الفلاتر' : 'Try adjusting your filters'}
            </p>
            <button 
              onClick={clearFilters} 
              className="btn btn-outline"
            >
              {t('filters.clearFilters')}
            </button>
          </div>
        ) : (
          <StaggeredList 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            staggerDelay={0.1}
          >
            {processedProperties?.map((item: any) => (
              <PropertyCard
                key={item.property.id}
                property={item.property}
              />
            ))}
          </StaggeredList>
        )}

        {/* Pagination */}
        {!isLoading && !error && propertiesData?.data?.pagination && propertiesData.data.pagination.totalPages > 1 && (
          <div className="mt-8">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {Array.from({ length: Math.min(5, propertiesData.data.pagination.totalPages) }, (_, i) => {
                  const totalPages = propertiesData.data.pagination.totalPages;
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === propertiesData.data.pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              {isArabic ? 'صفحة' : 'Page'} {currentPage} {isArabic ? 'من' : 'of'} {propertiesData.data.pagination.totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
