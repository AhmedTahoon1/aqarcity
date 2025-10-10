import { useState, useEffect } from 'react';
import { authService, User } from '../lib/auth';
import { favoritesAPI } from '../lib/api';
import { AUTH_ENABLED } from '../config/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!AUTH_ENABLED) {
        // Auth disabled - no user
        setUser(null);
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('accessToken');
      if (token && authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          // Only sync favorites if user is authenticated
          if (userData) {
            await syncLocalFavorites();
          }
        } catch (error: any) {
          if (error.response?.status === 403 || error.response?.status === 401) {
            authService.logout();
          }
          setUser(null);
        }
      } else {
        authService.logout();
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);
  
  const syncLocalFavorites = async () => {
    // Only sync if user is authenticated
    if (!user) return;
    
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
        
        // Clear localStorage after successful sync only for authenticated users
        if (user) {
          localStorage.removeItem('favorites');
        }
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
      // Don't remove localStorage on error to preserve data
    }
  };

  const logout = () => {
    if (!AUTH_ENABLED) {
      // Auth disabled - do nothing
      return;
    }
    authService.logout();
    setUser(null);
  };
  
  const refreshAuth = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  return { 
    user, 
    loading, 
    logout, 
    refreshAuth, 
    isAuthenticated: AUTH_ENABLED ? (authService.isAuthenticated() && !!user) : false 
  };
};