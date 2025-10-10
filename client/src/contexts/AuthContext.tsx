import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../lib/auth';
import { favoritesAPI, usersAPI } from '../lib/api';
import SearchDiscoveryModal from '../components/modals/SearchDiscoveryModal';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  discoveredSearches: any[];
  showDiscoveryModal: boolean;
  setShowDiscoveryModal: (show: boolean) => void;
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
  const [discoveredSearches, setDiscoveredSearches] = useState<any[]>([]);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          await syncLocalFavorites();
          await checkForGuestSearches(userData);
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
  
  const checkForGuestSearches = async (userData: User) => {
    try {
      const response = await usersAPI.discoverSearches();
      if (response.data.searches.length > 0) {
        setDiscoveredSearches(response.data.searches);
        // عرض المودال بعد ثانيتين لإعطاء المستخدم وقت للاستقرار
        setTimeout(() => {
          setShowDiscoveryModal(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Error discovering searches:', error);
    }
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
    refreshAuth,
    discoveredSearches,
    showDiscoveryModal,
    setShowDiscoveryModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Search Discovery Modal */}
      <SearchDiscoveryModal
        isOpen={showDiscoveryModal}
        onClose={() => setShowDiscoveryModal(false)}
        discoveredSearches={discoveredSearches}
      />
    </AuthContext.Provider>
  );
};