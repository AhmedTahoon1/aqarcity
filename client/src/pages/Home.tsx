import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { propertiesAPI } from '@/lib/api';
import AdvancedSearchBar from '@/components/shared/AdvancedSearchBar';
import PropertyCard from '@/components/property/PropertyCard';
import { PropertyCardSkeleton } from '@/components/skeletons';
import { StaggeredList, AnimatedContainer, AnimatedButton } from '@/components/animations';
import { ArrowRight, Star, Users, Building } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  const { data: featuredProperties, isLoading, error } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => propertiesAPI.getFeatured(),
    staleTime: 60000,
    cacheTime: 300000,
    retry: false,
  });

  // Fallback data when API fails
  const mockProperties = {
    data: [
      {
        property: {
          id: '1',
          titleEn: 'Luxury Villa in Dubai Marina',
          titleAr: 'فيلا فاخرة في دبي مارينا',
          price: '2500000',
          city: 'Dubai',
          areaName: 'Dubai Marina',
          bedrooms: 4,
          bathrooms: 3,
          areaSqft: 3500,
          images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
          status: 'sale',
          propertyType: 'villa'
        }
      },
      {
        property: {
          id: '2',
          titleEn: 'Modern Apartment in Downtown',
          titleAr: 'شقة حديثة في وسط المدينة',
          price: '1200000',
          city: 'Dubai',
          areaName: 'Downtown Dubai',
          bedrooms: 2,
          bathrooms: 2,
          areaSqft: 1200,
          images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
          status: 'sale',
          propertyType: 'apartment'
        }
      }
    ]
  };

  const displayProperties = error ? mockProperties : featuredProperties;

  const handleSearch = (filters: any) => {
    // Build query string from filters with correct parameter names
    const params = new URLSearchParams();
    
    if (filters.location) {
      params.append('location', filters.location);
    }
    if (filters.propertyType) {
      params.append('type', filters.propertyType);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.bedrooms) {
      params.append('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms) {
      params.append('bathrooms', filters.bathrooms);
    }
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice);
    }
    
    // Navigate to properties page with search params
    setLocation(`/properties?${params.toString()}`);
  };

  const stats = [
    { icon: Building, value: '5000+', label: 'Properties' },
    { icon: Users, value: '500+', label: 'Agents' },
    { icon: Star, value: '4.8', label: 'Rating' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-4 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="block">{t('hero.title')}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            
            {/* Advanced Search Bar */}
            <div className="max-w-6xl mx-auto animate-slide-up">
              <AdvancedSearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0" style={{transform:'rotate(180DEG)'}}>
          <svg className="w-full h-12 md:h-24 fill-current text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-medium hover:shadow-hard transition-all duration-300 transform hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl mb-4 shadow-lg">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="animate-fade-in">
              <h2 className="section-title mb-3">
                Featured Properties
              </h2>
              <p className="text-gray-600 text-lg">
                Discover our handpicked selection of premium properties
              </p>
            </div>
            <button 
              onClick={() => setLocation('/properties')}
              className="hidden md:flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold group"
            >
              <span>{t('common.viewAll')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProperties?.data && Array.isArray(displayProperties.data) && displayProperties.data.length > 0 ? 
                displayProperties.data.map((item: any) => (
                  <PropertyCard
                    key={item.property?.id || Math.random()}
                    property={item.property}
                  />
                )) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No featured properties available</p>
                  </div>
                )
              }
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found their perfect home with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton 
              onClick={() => setLocation('/properties')}
              className="bg-white text-[#009942] hover:bg-gray-100 hover:text-white text-lg px-8 py-4"
              size="lg"
            >
              Browse Properties
            </AnimatedButton>
            <AnimatedButton 
              onClick={() => setLocation('/contact')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
              size="lg"
            >
              Contact Agent
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
}