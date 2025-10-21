import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin } from 'lucide-react';

interface Emirate {
  id: string;
  nameEn: string;
  nameAr: string;
  areas?: Area[];
}

interface Area {
  id: string;
  nameEn: string;
  nameAr: string;
  emirateId: string;
}

interface HierarchicalCitySelectProps {
  value?: string;
  onChange: (locationId: string, locationName: string, type: 'emirate' | 'area') => void;
  placeholder?: string;
  className?: string;
}

export default function EmirateAreaSelect({ 
  value, 
  onChange, 
  placeholder,
  className = '' 
}: HierarchicalCitySelectProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [emirates, setEmirates] = useState<Emirate[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; type: 'emirate' | 'area' } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmiratesAndAreas();
  }, []);

  useEffect(() => {
    if (value && emirates.length > 0) {
      findSelectedLocation(value);
    }
  }, [value, emirates]);

  const fetchEmiratesAndAreas = async () => {
    try {
      const response = await fetch('/api/v1/cities');
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setEmirates(data);
      } else {
        console.error('Expected array but got:', typeof data, data);
        setEmirates([]);
      }
    } catch (error) {
      console.error('Error fetching emirates and areas:', error);
      setEmirates([]);
    } finally {
      setLoading(false);
    }
  };

  const findSelectedLocation = (locationId: string) => {
    for (const emirate of emirates) {
      if (emirate.id === locationId) {
        setSelectedLocation({ name: isArabic ? emirate.nameAr : emirate.nameEn, type: 'emirate' });
        return;
      }
      if (emirate.areas) {
        for (const area of emirate.areas) {
          if (area.id === locationId) {
            setSelectedLocation({ name: isArabic ? area.nameAr : area.nameEn, type: 'area' });
            return;
          }
        }
      }
    }
  };

  const handleLocationSelect = (location: Emirate | Area, type: 'emirate' | 'area') => {
    const name = isArabic ? location.nameAr : location.nameEn;
    setSelectedLocation({ name, type });
    onChange(location.id, name, type);
    setIsOpen(false);
  };

  const getDisplayName = (location: Emirate | Area) => {
    return isArabic ? location.nameAr : location.nameEn;
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
          <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLocation ? selectedLocation.name : (placeholder || (isArabic ? 'اختر الموقع' : 'Select Location'))}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {emirates.map((emirate) => (
            <div key={emirate.id}>
              {/* Emirate Header */}
              <button
                onClick={() => handleLocationSelect(emirate, 'emirate')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 font-medium text-primary-600"
              >
                {getDisplayName(emirate)}
              </button>
              
              {/* Areas */}
              {emirate.areas && emirate.areas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleLocationSelect(area, 'area')}
                  className="w-full px-8 py-2 text-left hover:bg-gray-50 text-gray-700 text-sm border-b border-gray-50 last:border-b-0"
                >
                  {getDisplayName(area)}
                </button>
              ))}
            </div>
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