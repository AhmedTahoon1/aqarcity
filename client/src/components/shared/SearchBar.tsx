import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { locationsAPI } from '@/lib/api';
import { SearchBarSkeleton } from '@/components/skeletons';

interface SearchBarProps {
  onSearch: (filters: any) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className = '' }: SearchBarProps) {
  const { t, i18n } = useTranslation();
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  });

  // Fetch locations from database
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationsAPI.getAll(),
  });

  if (locationsLoading) {
    return <SearchBarSkeleton />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'penthouse', label: 'Penthouse' },
  ];

  return (
    <form onSubmit={handleSubmit} className={`glass-effect rounded-2xl shadow-hard p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none text-gray-900 bg-white transition-all duration-200"
          >
            <option value="">{t('hero.searchPlaceholder')}</option>
            {locationsData?.data?.map((location: any) => (
              <option key={location.id} value={location.city}>
                {i18n.language === 'ar' ? location.nameAr : location.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none text-gray-900 bg-white transition-all duration-200"
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full pl-10 pr-2 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white transition-all duration-200"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-2 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="btn btn-primary flex items-center justify-center space-x-2 rtl:space-x-reverse text-base font-bold h-12"
        >
          <Search className="w-5 h-5" />
          <span>{t('hero.searchButton')}</span>
        </button>
      </div>
    </form>
  );
}