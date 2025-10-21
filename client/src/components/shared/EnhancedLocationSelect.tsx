import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin, Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface FlatAddress {
  id: string;
  nameEn: string;
  nameAr: string;
  level: number;
  displayName: string;
  displayNameAr: string;
  path: string;
  propertyCount?: number;
}

interface EnhancedLocationSelectProps {
  value?: string;
  onChange: (addressId: string, addressName: string) => void;
  placeholder?: string;
  className?: string;
  maxLevel?: number;
  showStats?: boolean;
  searchable?: boolean;
}

export default function EnhancedLocationSelect({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  maxLevel = 2,
  showStats = true,
  searchable = true
}: EnhancedLocationSelectProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [addresses, setAddresses] = useState<FlatAddress[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<FlatAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchFlatAddresses();
  }, [debouncedSearch, showStats, maxLevel]);

  useEffect(() => {
    if (value && addresses.length > 0) {
      const found = addresses.find(addr => addr.id === value);
      if (found) {
        setSelectedAddress(found);
      }
    }
  }, [value, addresses]);

  const fetchFlatAddresses = async () => {
    try {
      const params = new URLSearchParams();
      if (showStats) params.append('withStats', 'true');
      if (debouncedSearch) params.append('search', debouncedSearch);
      
      const response = await fetch(`/api/v1/addresses/flat?${params.toString()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAddresses(data.filter((addr: FlatAddress) => addr.level <= maxLevel));
      } else {
        console.error('Expected array but got:', typeof data, data);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching flat addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: FlatAddress) => {
    setSelectedAddress(address);
    onChange(address.id, isArabic ? address.nameAr : address.nameEn);
    setSearchTerm('');
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAddress(null);
    onChange('', '');
    setSearchTerm('');
  };

  const getDisplayName = (address: FlatAddress) => {
    return isArabic ? address.displayNameAr : address.displayName;
  };

  const getSelectedDisplayName = () => {
    if (!selectedAddress) return null;
    return isArabic ? selectedAddress.nameAr : selectedAddress.nameEn;
  };

  if (loading && !searchTerm) {
    return (
      <div className="relative">
        <div className="input-field animate-pulse bg-gray-200 h-10"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full flex items-center justify-between text-left text-sm"
      >
        <div className="flex items-center flex-1 min-w-0">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className={`truncate ${selectedAddress ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedAddress ? getSelectedDisplayName() : (placeholder || (isArabic ? 'اختر الموقع' : 'Select Location'))}
          </span>
          {selectedAddress && showStats && selectedAddress.propertyCount !== undefined && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full flex-shrink-0">
              {selectedAddress.propertyCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
          {selectedAddress && (
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              type="button"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {searchable && (
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isArabic ? 'ابحث عن الموقع...' : 'Search location...'}
                  className="w-full pl-10 rtl:pl-3 rtl:pr-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  autoFocus
                />
              </div>
            </div>
          )}
          
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                {isArabic ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 
                  (isArabic ? 'لا توجد نتائج' : 'No results found') :
                  (isArabic ? 'لا توجد مواقع' : 'No locations available')
                }
              </div>
            ) : (
              addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleAddressSelect(address)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 text-sm border-b border-gray-50 last:border-b-0 font-mono transition-colors ${
                    address.level === 0 ? 'font-semibold text-primary-600 bg-primary-50' :
                    address.level === 1 ? 'text-gray-700' :
                    'text-gray-600'
                  } ${selectedAddress?.id === address.id ? 'bg-primary-100' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{getDisplayName(address)}</span>
                    {showStats && address.propertyCount !== undefined && address.propertyCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex-shrink-0">
                        {address.propertyCount}
                      </span>
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