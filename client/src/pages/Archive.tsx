import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { propertiesAPI } from '../lib/api';
import PropertyCard from '../components/property/PropertyCard';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Property {
  property: {
    id: string;
    titleEn: string;
    titleAr: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    areaSqft: number;
    images: string[];
    propertyType: string;
    status: string;
    agent?: {
      id: string;
      phone: string;
      whatsapp: string;
      email: string;
    };
  };
  agent?: {
    id: string;
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
}

export default function Archive() {
  const { t, i18n } = useTranslation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArchivedProperties();
  }, [currentPage]);

  const fetchArchivedProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getArchived({
        page: currentPage,
        limit: 12
      });
      setProperties(response.data.properties);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching archived properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {i18n.language === 'ar' ? 'أرشيف العقارات المباعة' : 'Sold Properties Archive'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {i18n.language === 'ar' 
              ? 'تصفح العقارات التي تم بيعها مؤخراً' 
              : 'Browse recently sold properties'
            }
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              {i18n.language === 'ar' 
                ? 'لا توجد عقارات مباعة في الأرشيف' 
                : 'No sold properties in archive'
              }
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((item) => (
                <PropertyCard
                  key={item.property.id}
                  property={{
                    id: item.property.id,
                    title: i18n.language === 'ar' ? item.property.titleAr : item.property.titleEn,
                    price: item.property.price,
                    location: item.property.location,
                    bedrooms: item.property.bedrooms,
                    bathrooms: item.property.bathrooms,
                    area: item.property.areaSqft,
                    images: item.property.images,
                    type: item.property.propertyType,
                    status: item.property.status,
                    agent: item.agent
                  }}
                  isArchived={true}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{i18n.language === 'ar' ? 'السابق' : 'Previous'}</span>
                </Button>
                
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {i18n.language === 'ar' 
                    ? `صفحة ${currentPage} من ${totalPages}`
                    : `Page ${currentPage} of ${totalPages}`
                  }
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 rtl:space-x-reverse"
                >
                  <span>{i18n.language === 'ar' ? 'التالي' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}