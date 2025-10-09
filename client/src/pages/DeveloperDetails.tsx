import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useRoute } from 'wouter';
import { developersAPI } from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import { Building2, Globe, MapPin, Phone, Mail } from 'lucide-react';

export default function DeveloperDetails() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [match, params] = useRoute('/developers/:id');
  const developerId = params?.id;

  const { data: developer, isLoading: developerLoading } = useQuery({
    queryKey: ['developer', developerId],
    queryFn: () => developersAPI.getById(developerId!),
    enabled: !!developerId,
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['developer-properties', developerId],
    queryFn: () => developersAPI.getProperties(developerId!),
    enabled: !!developerId,
  });

  if (developerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!developer?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isArabic ? 'المطور غير موجود' : 'Developer not found'}
          </h2>
          <p className="text-gray-600">
            {isArabic ? 'لم يتم العثور على المطور المطلوب' : 'The requested developer could not be found'}
          </p>
        </div>
      </div>
    );
  }

  const dev = developer.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
              {dev.logo ? (
                <img 
                  src={dev.logo} 
                  alt={isArabic ? dev.nameAr : dev.nameEn}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-primary-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {isArabic ? dev.nameAr : dev.nameEn}
              </h1>
              <p className="text-primary-100 text-lg mb-4">
                {isArabic ? dev.descriptionAr : dev.descriptionEn}
              </p>
              
              <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  <span>{dev.projectsCount} {isArabic ? 'مشروع' : 'Projects'}</span>
                </div>
                
                {dev.website && (
                  <a 
                    href={dev.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary-200 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span>{isArabic ? 'الموقع الإلكتروني' : 'Website'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isArabic ? 'مشاريع المطور' : 'Developer Properties'}
          </h2>
          <p className="text-gray-600">
            {isArabic ? 'استكشف جميع المشاريع العقارية لهذا المطور' : 'Explore all real estate projects by this developer'}
          </p>
        </div>

        {propertiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {properties?.data && properties.data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.data.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    property={{
                      ...property,
                      agent: property.agent || {
                        id: dev.id,
                        phone: dev.phone,
                        whatsapp: dev.whatsapp
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isArabic ? 'لا توجد مشاريع' : 'No properties found'}
                </h3>
                <p className="text-gray-600">
                  {isArabic ? 'لا توجد مشاريع عقارية لهذا المطور حالياً' : 'No properties available for this developer at the moment'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}