import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../lib/auth';
import { favoritesAPI } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          await syncLocalFavorites();
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
    try {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (localFavorites.length > 0) {
        for (const property of localFavorites) {
          try {
            await favoritesAPI.add(property.id);
          } catch (error: any) {
            if (error.response?.status !== 400) {
              throw error;
            }
          }
        }
        localStorage.removeItem('favorites');
      }
    } catch (error) {
      localStorage.removeItem('favorites');
    }
  };

  const logout = () => {
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

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated() && !!user,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};