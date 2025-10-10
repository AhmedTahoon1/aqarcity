import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Building2, Search } from 'lucide-react';
import { getEmiratesWithCities, getLocationById, type Location } from '@/data/uae-locations';

interface LocationSelectProps {
  value?: string;
  onChange: (locationId: string | undefined) => void;
  placeholder?: string;
}

export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  placeholder = "اختر الموقع"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const emiratesWithCities = getEmiratesWithCities();
  const selectedLocation = value && value !== '' ? getLocationById(value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEmirates = emiratesWithCities.map(emirate => ({
    ...emirate,
    cities: emirate.cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(emirate => 
    emirate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emirate.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emirate.cities.length > 0
  );

  const handleSelect = (locationId: string) => {
    onChange(locationId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(undefined);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-primary-500" />
          <span className={selectedLocation ? "text-gray-700 font-medium" : "text-gray-500 font-medium"}>
            {selectedLocation ? selectedLocation.name : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          {/* شريط البحث */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن المدينة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-900 pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* خيار "جميع المواقع" */}
          <div className="p-2">
            <button
              onClick={handleClear}
              className="w-full text-right px-4 py-3 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-3 group"
            >
              <MapPin className="w-4 h-4 text-primary-500" />
              <span className="text-gray-700 font-medium group-hover:text-primary-600">جميع المواقع</span>
            </button>
          </div>

          {/* قائمة الإمارات والمدن */}
          <div className="max-h-80 overflow-y-auto">
            {filteredEmirates.map((emirate) => (
              <div key={emirate.id} className="border-t border-gray-100">
                {/* الإمارة الرئيسية */}
                <button
                  onClick={() => handleSelect(emirate.id)}
                  className="w-full text-right px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 font-medium"
                >
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="text-gray-900">{emirate.name}</div>
                    <div className="text-xs text-gray-500">{emirate.nameEn}</div>
                  </div>
                  <div className="mr-auto">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {emirate.cities.length} مدينة
                    </span>
                  </div>
                </button>

                {/* المدن الفرعية */}
                {emirate.cities.length > 0 && (
                  <div className="bg-gray-50">
                    {emirate.cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleSelect(city.id)}
                        className="w-full text-right px-8 py-2 hover:bg-white transition-colors flex items-center gap-3 text-sm"
                      >
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="text-gray-700">{city.name}</div>
                          <div className="text-xs text-gray-500">{city.nameEn}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredEmirates.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              لا توجد نتائج للبحث "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};