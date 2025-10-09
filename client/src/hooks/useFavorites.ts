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
      if (AUTH_ENABLED && isAuthenticated) {
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
      if (AUTH_ENABLED && isAuthenticated) {
        await favoritesAPI.add(property.id);
        setFavorites(prev => [...prev, property.id]);
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = [...localFavorites, property];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(prev => [...prev, property.id]);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setFavorites(prev => prev.includes(property.id) ? prev : [...prev, property.id]);
      }
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    try {
      if (AUTH_ENABLED && isAuthenticated) {
        await favoritesAPI.remove(propertyId);
        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = localFavorites.filter((fav: Property) => fav.id !== propertyId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
    } catch (error) {
      // Silently handle errors when auth is disabled
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const syncLocalToDatabase = async () => {
    if (!isAuthenticated) return;
    
    try {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      for (const property of localFavorites) {
        await favoritesAPI.add(property.id);
      }
      localStorage.removeItem('favorites');
      loadFavorites();
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