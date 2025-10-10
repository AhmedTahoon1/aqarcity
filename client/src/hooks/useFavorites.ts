import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { favoritesAPI } from '../lib/api';
import { AUTH_ENABLED } from '../config/auth';

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

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      if (isAuthenticated) {
        const response = await favoritesAPI.getAll();
        const favoriteIds = response.data.map((item: any) => item.property.id);
        setFavorites(favoriteIds);
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const favoriteIds = localFavorites.map((fav: Property) => fav.id);
        setFavorites(favoriteIds);
      }
    } catch (error) {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const favoriteIds = localFavorites.map((fav: Property) => fav.id);
      setFavorites(favoriteIds);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (property: Property) => {
    try {
      if (isAuthenticated) {
        await favoritesAPI.add(property.id);
        setFavorites(prev => [...prev, property.id]);
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isAlreadyFavorite = localFavorites.some((fav: Property) => fav.id === property.id);
        if (!isAlreadyFavorite) {
          const updatedFavorites = [...localFavorites, property];
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          setFavorites(prev => [...prev, property.id]);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setFavorites(prev => prev.includes(property.id) ? prev : [...prev, property.id]);
      }
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    try {
      if (isAuthenticated) {
        await favoritesAPI.remove(propertyId);
        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = localFavorites.filter((fav: Property) => fav.id !== propertyId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const syncLocalToDatabase = async () => {
    // Only sync if user is authenticated
    if (!isAuthenticated) return;
    
    try {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (localFavorites.length > 0) {
        // Get existing database favorites
        const response = await favoritesAPI.getAll();
        const existingIds = response.data.map((item: any) => item.property.id);
        
        // Add only new favorites to database
        for (const property of localFavorites) {
          if (!existingIds.includes(property.id)) {
            try {
              await favoritesAPI.add(property.id);
            } catch (error: any) {
              if (error.response?.status !== 400) {
                throw error;
              }
            }
          }
        }
        
        // Clear localStorage after successful sync only if user is authenticated
        if (isAuthenticated) {
          localStorage.removeItem('favorites');
        }
        loadFavorites();
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    syncLocalToDatabase,
    loadFavorites
  };
};