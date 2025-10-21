import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin } from 'lucide-react';

interface FlatAddress {
  id: string;
  nameEn: string;
  nameAr: string;
  level: number;
  displayName: string;
  displayNameAr: string;
  path: string;
}

interface SingleHierarchicalSelectProps {
  value?: string;
  onChange: (addressId: string, addressName: string) => void;
  placeholder?: string;
  className?: string;
  maxLevel?: number;
}

export default function SingleHierarchicalSelect({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  maxLevel = 2
}: SingleHierarchicalSelectProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [addresses, setAddresses] = useState<FlatAddress[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<FlatAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlatAddresses();
  }, []);

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
      const response = await fetch('/api/v1/addresses/flat');
      const data = await response.json();
      
      // Ensure data is an array before filtering
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
    setIsOpen(false);
  };

  const getDisplayName = (address: FlatAddress) => {
    return isArabic ? address.displayNameAr : address.displayName;
  };

  const getSelectedDisplayName = () => {
    if (!selectedAddress) return null;
    return isArabic ? selectedAddress.nameAr : selectedAddress.nameEn;
  };

  if (loading) {
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
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className={selectedAddress ? 'text-gray-900' : 'text-gray-500'}>
            {selectedAddress ? getSelectedDisplayName() : (placeholder || (isArabic ? 'اختر الموقع' : 'Select Location'))}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {addresses.map((address) => (
            <button
              key={address.id}
              onClick={() => handleAddressSelect(address)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 text-sm border-b border-gray-50 last:border-b-0 font-mono ${
                address.level === 0 ? 'font-semibold text-primary-600 bg-primary-50' :
                address.level === 1 ? 'text-gray-700' :
                'text-gray-600'
              } ${selectedAddress?.id === address.id ? 'bg-primary-100' : ''}`}
            >
              {getDisplayName(address)}
            </button>
          ))}
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