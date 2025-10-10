import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { propertiesAPI } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyListSkeleton } from '@/components/skeletons';
import { StaggeredList, AnimatedContainer } from '@/components/animations';
import { Grid, List, ChevronLeft, ChevronRight, AlertCircle, X, Bookmark, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import SaveSearchModal from '@/components/modals/SaveSearchModal';
import GuestSaveSearchModal from '@/components/modals/GuestSaveSearchModal';
import { useAuthContext } from '@/contexts/AuthContext';
import { LocationSelect } from '@/components/ui/LocationSelect';

export default function Properties() {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const [filters, setFilters] = useState<any>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showGuestSaveModal, setShowGuestSaveModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const isArabic = i18n.language === 'ar';



  const propertyTypes = [
    { value: 'villa', label: t('filters.villa') },
    { value: 'apartment', label: t('filters.apartment') },
    { value: 'townhouse', label: t('filters.townhouse') },
    { value: 'penthouse', label: t('filters.penthouse') },
  ];

  const statusOptions = [
    { value: 'sale', label: isArabic ? 'للبيع' : 'For Sale' },
    { value: 'rent', label: isArabic ? 'للإيجار' : 'For Rent' }
  ];

  const bedroomOptions = [
    { value: '0', label: t('filters.studio') },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' },
  ];

  // Read filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: any = {};
    
    // Read all possible parameters from URL
    if (params.get('location')) urlFilters.location = params.get('location');
    if (params.get('city')) urlFilters.city = params.get('city');
    if (params.get('type')) urlFilters.type = params.get('type');
    if (params.get('status')) urlFilters.status = params.get('status');
    if (params.get('bedrooms')) urlFilters.bedrooms = params.get('bedrooms');
    if (params.get('bathrooms')) urlFilters.bathrooms = params.get('bathrooms');
    if (params.get('minPrice')) urlFilters.minPrice = params.get('minPrice');
    if (params.get('maxPrice')) urlFilters.maxPrice = params.get('maxPrice');
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [location]);

  // Debounce filters to reduce server requests
  const debouncedFilters = useDebounce(filters, 500);
  
  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties', debouncedFilters, currentPage, sortBy],
    queryFn: () => propertiesAPI.getAll({ ...debouncedFilters, page: currentPage, limit: 12, sort: sortBy }),
    staleTime: 30000, // Cache for 30 seconds
    cacheTime: 300000, // Keep in cache for 5 minutes
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
    
    // Update URL to reflect current filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        params.append(k, v);
      }
    });
    
    const newUrl = params.toString() ? `/properties?${params.toString()}` : '/properties';
    window.history.replaceState({}, '', newUrl);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
    // Clear URL parameters
    window.history.replaceState({}, '', '/properties');
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
            {t('property.subtitle')}
          </p>
        </div>

        {/* Horizontal Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('property.location')}
              </label>
              <LocationSelect
                value={filters.location || ''}
                onChange={(locationId) => handleFilterChange('location', locationId || '')}
                placeholder={isArabic ? 'اختر الموقع' : 'Select Location'}
              />
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

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.bathrooms')}
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="">{t('filters.anyBathrooms')}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {t('filters.minPrice')}
              </label>
              <input
                type="number"
                placeholder={t('filters.minPricePlaceholder')}
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
                placeholder={t('filters.maxPricePlaceholder')}
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-700">
                  {t('filters.activeFilters')}
                </span>
                <span className="text-xs text-primary-600">
                  {Object.values(filters).filter(v => v !== '').length} {t('filters.filtersCount')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.location && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('property.location')}: {filters.location}
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('property.type')}: {propertyTypes.find(t => t.value === filters.type)?.label}
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('property.status')}: {statusOptions.find(s => s.value === filters.status)?.label}
                  </span>
                )}
                {filters.bedrooms && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('property.bedrooms')}: {bedroomOptions.find(b => b.value === filters.bedrooms)?.label}
                  </span>
                )}
                {filters.bathrooms && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('property.bathrooms')}: {filters.bathrooms}
                  </span>
                )}
                {filters.minPrice && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('filters.minPrice')}: {filters.minPrice}
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {t('filters.maxPrice')}: {filters.maxPrice}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{t('filters.clearFilters')}</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => {
                  if (!hasActiveFilters && Object.keys(filters).length === 0) {
                    alert(t('search.selectFiltersFirst'));
                    return;
                  }
                  
                  if (isAuthenticated) {
                    setShowSaveModal(true);
                  } else {
                    setShowGuestSaveModal(true);
                  }
                }}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  hasActiveFilters || Object.keys(filters).length > 0
                    ? 'text-white bg-primary-600 hover:bg-primary-700'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{t('search.saveSearch')}</span>
              </button>
              
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Info className="w-4 h-4" />
                </button>
                
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10">
                    <div className="text-center">
                      <>
                        <p className="font-semibold mb-1">{t('search.saveSearch')}</p>
                        <p>{t('search.saveSearchDescription')}</p>
                      </>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle & Sort */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="text-sm text-gray-600">
            {propertiesData?.data?.pagination?.total || 0} {t('property.properties')}
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">{t('property.newest')}</option>
              <option value="oldest">{t('property.oldest')}</option>
              <option value="price_asc">{t('property.priceLowHigh')}</option>
              <option value="price_desc">{t('property.priceHighLow')}</option>
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
              {t('property.loadingFailed')}
            </h3>
            <p className="text-red-700 mb-4">
              {t('property.tryAgain')}
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
              {t('property.noProperties')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('property.adjustFilters')}
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
              {t('property.page')} {currentPage} {t('property.of')} {propertiesData.data.pagination.totalPages}
            </div>
          </div>
        )}

        {/* Save Search Modals */}
        <SaveSearchModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          searchCriteria={filters}
        />
        
        <GuestSaveSearchModal
          isOpen={showGuestSaveModal}
          onClose={() => setShowGuestSaveModal(false)}
          searchCriteria={filters}
        />
      </div>
    </div>
  );
}
