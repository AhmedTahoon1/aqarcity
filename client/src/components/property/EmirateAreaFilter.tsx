import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Emirate {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface Area {
  id: string;
  nameEn: string;
  nameAr: string;
  parentId: string;
}

interface EmirateAreaFilterProps {
  selectedEmirate: string;
  selectedArea: string;
  onEmirateChange: (emirateId: string) => void;
  onAreaChange: (areaId: string) => void;
}

export default function EmirateAreaFilter({
  selectedEmirate,
  selectedArea,
  onEmirateChange,
  onAreaChange
}: EmirateAreaFilterProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [emirates, setEmirates] = useState<Emirate[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmirates();
    fetchAllAreas();
  }, []);

  useEffect(() => {
    if (selectedEmirate) {
      fetchAreas(selectedEmirate);
    } else {
      setAreas(allAreas); // Show all areas when no emirate is selected
    }
  }, [selectedEmirate, allAreas]);

  const fetchEmirates = async () => {
    try {
      const response = await fetch('/api/v1/addresses/level/0');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEmirates(data);
      }
    } catch (error) {
      console.error('Error fetching emirates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAreas = async () => {
    try {
      const response = await fetch('/api/v1/addresses/areas');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllAreas(data);
      }
    } catch (error) {
      console.error('Error fetching all areas:', error);
    }
  };

  const fetchAreas = async (emirateId: string) => {
    try {
      const response = await fetch(`/api/v1/addresses/${emirateId}/children`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setAreas(data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

  const handleEmirateChange = (emirateId: string) => {
    onEmirateChange(emirateId);
    onAreaChange(''); // Reset area when emirate changes
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Emirate Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filters.emirate')}
        </label>
        <select
          value={selectedEmirate}
          onChange={(e) => handleEmirateChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">{t('filters.allEmirates')}</option>
          {emirates.map(emirate => (
            <option key={emirate.id} value={emirate.id}>
              {isArabic ? emirate.nameAr : emirate.nameEn}
            </option>
          ))}
        </select>
      </div>

      {/* Area Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('filters.area')}
        </label>
        <select
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">{t('filters.allAreas')}</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>
              {isArabic ? area.nameAr : area.nameEn}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}