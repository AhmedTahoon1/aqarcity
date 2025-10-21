import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';

interface Address {
  id: string;
  nameEn: string;
  nameAr: string;
  level: number;
  path: string;
  parentId?: string;
  children?: Address[];
}

interface HierarchicalAddressSelectProps {
  value?: string;
  onChange: (addressId: string, addressName: string, breadcrumb: Address[]) => void;
  placeholder?: string;
  className?: string;
  maxLevel?: number; // Limit selection to specific level
}

export default function HierarchicalAddressSelect({ 
  value, 
  onChange, 
  placeholder,
  className = '',
  maxLevel = 2 // Allow selection up to level 2 by default
}: HierarchicalAddressSelectProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedBreadcrumb, setSelectedBreadcrumb] = useState<Address[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (value && addresses.length > 0) {
      findSelectedAddress(value);
    }
  }, [value, addresses]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/v1/addresses');
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        console.error('Expected array but got:', typeof data, data);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const findSelectedAddress = async (addressId: string) => {
    try {
      // Get breadcrumb for selected address
      const breadcrumbResponse = await fetch(`/api/v1/addresses/${addressId}/breadcrumb`);
      const breadcrumb = await breadcrumbResponse.json();
      
      if (breadcrumb.length > 0) {
        const selected = breadcrumb[breadcrumb.length - 1];
        setSelectedAddress(selected);
        setSelectedBreadcrumb(breadcrumb);
        
        // Expand parent nodes
        const parentIds = breadcrumb.slice(0, -1).map((addr: Address) => addr.id);
        setExpandedNodes(new Set(parentIds));
      }
    } catch (error) {
      console.error('Error finding selected address:', error);
    }
  };

  const handleAddressSelect = (address: Address) => {
    if (address.level <= maxLevel) {
      setSelectedAddress(address);
      onChange(address.id, getDisplayName(address), selectedBreadcrumb);
      setIsOpen(false);
    }
  };

  const toggleExpanded = (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(addressId)) {
      newExpanded.delete(addressId);
    } else {
      newExpanded.add(addressId);
    }
    setExpandedNodes(newExpanded);
  };

  const getDisplayName = (address: Address) => {
    return isArabic ? address.nameAr : address.nameEn;
  };

  const renderAddressTree = (addressList: Address[], level: number = 0) => {
    return addressList.map((address) => (
      <div key={address.id}>
        <div
          className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer ${
            level > 0 ? `ml-${level * 4}` : ''
          } ${address.level > maxLevel ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => handleAddressSelect(address)}
        >
          {address.children && address.children.length > 0 && (
            <button
              onClick={(e) => toggleExpanded(address.id, e)}
              className="mr-2 p-1 hover:bg-gray-200 rounded"
            >
              {expandedNodes.has(address.id) ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          <div className="flex items-center flex-1">
            <span className={`text-sm ${
              address.level === 0 ? 'font-semibold text-primary-600' :
              address.level === 1 ? 'font-medium text-gray-700' :
              'text-gray-600'
            }`}>
              {getDisplayName(address)}
            </span>
            <span className="ml-2 text-xs text-gray-400">
              Level {address.level}
            </span>
          </div>
        </div>
        
        {address.children && 
         address.children.length > 0 && 
         expandedNodes.has(address.id) && (
          <div className="border-l border-gray-200 ml-6">
            {renderAddressTree(address.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getBreadcrumbDisplay = () => {
    if (!selectedBreadcrumb.length) return null;
    
    return selectedBreadcrumb
      .map(addr => getDisplayName(addr))
      .join(' > ');
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="input-field animate-pulse bg-gray-200 h-12"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <span className={selectedAddress ? 'text-gray-900' : 'text-gray-500'}>
            {selectedAddress ? getBreadcrumbDisplay() : (placeholder || (isArabic ? 'اختر العنوان' : 'Select Address'))}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2 border-b border-gray-100 text-xs text-gray-500">
            {isArabic ? `يمكن الاختيار حتى المستوى ${maxLevel}` : `Can select up to level ${maxLevel}`}
          </div>
          {renderAddressTree(addresses)}
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