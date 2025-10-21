import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin, Search, X, Building2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface LocationOption {
  id: string;
  nameEn: string;
  nameAr: string;
  level: number;
  displayName: string;
  displayNameAr: string;
  path: string;
  propertyCount?: number;
}

interface SearchableLocationSelectProps {
  value?: string;
  onChange: (addressId: string, addressName: string) => void;
  placeholder?: string;
  className?: string;
  maxLevel?: number;
  showPropertyCount?: boolean;
}

export default function SearchableLocationSelect({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  maxLevel = 2,
  showPropertyCount = true
}: SearchableLocationSelectProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<LocationOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 200);

  useEffect(() => {
    // Add delay to prevent multiple rapid calls
    const timer = setTimeout(() => {
      fetchLocations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [maxLevel]);

  useEffect(() => {
    if (value && locations.length > 0) {
      const found = locations.find(loc => loc.id === value);
      setSelectedLocation(found || null);
    } else {
      setSelectedLocation(null);
    }
  }, [value, locations]);

  useEffect(() => {
    filterLocations();
  }, [debouncedSearch, locations]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (showPropertyCount) params.append('withStats', 'true');
      params.append('_t', Date.now().toString()); // Cache busting
      
      const response = await fetch(`/api/v1/addresses/flat?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limit exceeded, retrying in 2 seconds...');
          setTimeout(() => fetchLocations(), 2000);
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (Array.isArray(data)) {
        const filtered = data.filter((addr: LocationOption) => addr.level <= maxLevel);
        setLocations(filtered);
        setFilteredLocations(filtered);
      } else {
        console.error('Expected array but got:', typeof data);
        setLocations([]);
        setFilteredLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      
      // Fallback to basic locations if API fails
      const fallbackLocations = [
        { id: 'dubai', nameEn: 'Dubai', nameAr: 'دبي', level: 0, displayName: 'Dubai', displayNameAr: 'دبي', path: '/dubai' },
        { id: 'abu-dhabi', nameEn: 'Abu Dhabi', nameAr: 'أبوظبي', level: 0, displayName: 'Abu Dhabi', displayNameAr: 'أبوظبي', path: '/abu-dhabi' },
        { id: 'sharjah', nameEn: 'Sharjah', nameAr: 'الشارقة', level: 0, displayName: 'Sharjah', displayNameAr: 'الشارقة', path: '/sharjah' }
      ];
      
      setLocations(fallbackLocations);
      setFilteredLocations(fallbackLocations);
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = () => {
    if (!debouncedSearch.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = locations.filter(location => 
      location.nameEn.toLowerCase().includes(searchLower) ||
      location.nameAr.includes(debouncedSearch) ||
      location.displayName.toLowerCase().includes(searchLower) ||
      location.displayNameAr.includes(debouncedSearch)
    );
    
    setFilteredLocations(filtered);
  };

  const handleLocationSelect = (location: LocationOption) => {
    setSelectedLocation(location);
    onChange(location.id, isArabic ? location.nameAr : location.nameEn);
    setSearchTerm('');
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLocation(null);
    onChange('', '');
    setSearchTerm('');
  };

  const getDisplayName = (location: LocationOption) => {
    return isArabic ? location.displayNameAr : location.displayName;
  };

  const getSelectedDisplayName = () => {
    if (!selectedLocation) return null;
    return isArabic ? selectedLocation.nameAr : selectedLocation.nameEn;
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return '🏙️';
      case 1: return '🏢';
      case 2: return '📍';
      default: return '📍';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white hover:bg-gray-50 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className={`truncate ${selectedLocation ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedLocation ? getSelectedDisplayName() : (placeholder || (isArabic ? 'اختر الموقع' : 'Select Location'))}
          </span>
          {selectedLocation && showPropertyCount && selectedLocation.propertyCount !== undefined && selectedLocation.propertyCount > 0 && (
            <div className="ml-2 flex items-center space-x-1 rtl:space-x-reverse">
              <Building2 className="w-3 h-3 text-primary-600" />
              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                {selectedLocation.propertyCount}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse">
          {selectedLocation && (
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              type="button"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isArabic ? 'ابحث عن الموقع...' : 'Search location...'}
                className="w-full pl-10 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-72 overflow-y-auto">
            {/* خيار جميع المناطق */}
            {!loading && (
              <button
                onClick={() => handleLocationSelect({ id: '', nameEn: 'All Locations', nameAr: 'جميع المناطق', level: -1, displayName: 'All Locations', displayNameAr: 'جميع المناطق', path: '/all' })}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-200 transition-colors bg-blue-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-lg mr-2">🌍</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-700">
                        {isArabic ? 'جميع المناطق' : 'All Locations'}
                      </p>
                      <p className="text-xs text-blue-600">
                        {isArabic ? 'عرض جميع العقارات' : 'Show all properties'}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            )}
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">{isArabic ? 'جاري التحميل...' : 'Loading locations...'}</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="p-6 text-center">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {searchTerm ? 
                    (isArabic ? 'لا توجد نتائج للبحث' : 'No results found') :
                    (isArabic ? 'لا توجد مواقع متاحة' : 'No locations available')
                  }
                </p>
              </div>
            ) : (
              filteredLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedLocation?.id === location.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-lg mr-2">{getLevelIcon(location.level)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          location.level === 0 ? 'text-primary-700' :
                          location.level === 1 ? 'text-gray-800' :
                          'text-gray-600'
                        }`}>
                          {isArabic ? location.nameAr : location.nameEn}
                        </p>
                        {location.level > 0 && (
                          <p className="text-xs text-gray-500 truncate font-mono">
                            {getDisplayName(location)}
                          </p>
                        )}
                      </div>
                    </div>
                    {showPropertyCount && location.propertyCount !== undefined && location.propertyCount > 0 && (
                      <div className="flex items-center space-x-1 rtl:space-x-reverse ml-3">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                          {location.propertyCount}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}