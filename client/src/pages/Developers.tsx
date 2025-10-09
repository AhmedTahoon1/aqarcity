import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { developersAPI } from '@/lib/api';
import { DeveloperCardSkeleton } from '@/components/skeletons';
import { Building2, MapPin, Globe } from 'lucide-react';

export default function Developers() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data: developers, isLoading } = useQuery({
    queryKey: ['developers'],
    queryFn: () => developersAPI.getAll(),
  });



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isArabic ? 'المطورين العقاريين' : 'Real Estate Developers'}
          </h1>
          <p className="text-gray-600">
            {isArabic ? 'اكتشف أفضل المطورين العقاريين في الإمارات' : 'Discover top real estate developers in UAE'}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <DeveloperCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers?.data?.map((developer: any) => (
            <Link key={developer.id} href={`/developers/${developer.id}`}>
              <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center">
                  {developer.logo ? (
                    <img 
                      src={developer.logo} 
                      alt={isArabic ? developer.nameAr : developer.nameEn}
                      className="h-16 w-auto object-contain"
                    />
                  ) : (
                    <Building2 className="w-16 h-16 text-white" />
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isArabic ? developer.nameAr : developer.nameEn}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {isArabic ? developer.descriptionAr : developer.descriptionEn}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{developer.projectsCount} {isArabic ? 'مشروع' : 'Projects'}</span>
                    </div>
                    
                    {developer.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <span>{isArabic ? 'موقع إلكتروني' : 'Website'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}

        {(!developers?.data || developers.data.length === 0) && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isArabic ? 'لا توجد مطورين' : 'No developers found'}
            </h3>
            <p className="text-gray-600">
              {isArabic ? 'لم يتم العثور على مطورين عقاريين' : 'No real estate developers found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}