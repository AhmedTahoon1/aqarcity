import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { favoritesAPI } from '../lib/api';
import PropertyCard from '../components/property/PropertyCard';

interface Property {
  id: string;
  title: string;
  titleAr: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
}

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      if (isAuthenticated) {
        const response = await favoritesAPI.getAll();
        const favoriteProperties = response.data.map((item: any) => ({
          id: item.property.id,
          title: item.property.titleEn,
          titleAr: item.property.titleAr,
          price: parseFloat(item.property.price),
          location: item.property.location,
          bedrooms: item.property.bedrooms,
          bathrooms: item.property.bathrooms,
          area: item.property.areaSqft,
          images: item.property.images || [],
          type: item.property.propertyType
        }));
        setFavorites(favoriteProperties);
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(localFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      if (!isAuthenticated) {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(localFavorites);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      if (isAuthenticated) {
        await favoritesAPI.remove(propertyId);
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = localFavorites.filter((fav: Property) => fav.id !== propertyId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }
      setFavorites(prev => prev.filter(fav => fav.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {isArabic ? 'العقارات المفضلة' : 'Favorite Properties'}
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {favorites.length} {isArabic ? 'عقار' : 'properties'}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isArabic ? 'لا توجد عقارات مفضلة' : 'No favorite properties'}
            </h3>
            <p className="text-gray-500 mb-6">
              {isArabic 
                ? 'ابدأ بإضافة العقارات التي تعجبك إلى المفضلة'
                : 'Start adding properties you like to your favorites'
              }
            </p>
            <a href="/properties" className="btn btn-primary">
              {isArabic ? 'تصفح العقارات' : 'Browse Properties'}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}