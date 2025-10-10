import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../lib/auth';
import { favoritesAPI, usersAPI } from '../lib/api';
import SearchDiscoveryModal from '../components/modals/SearchDiscoveryModal';
import FavoritesSyncModal from '../components/modals/FavoritesSyncModal';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUserProfile: (profileData: { name: string; phone?: string; avatar?: string }) => Promise<User>;
  discoveredSearches: any[];
  showDiscoveryModal: boolean;
  setShowDiscoveryModal: (show: boolean) => void;
  showFavoritesSyncModal: boolean;
  setShowFavoritesSyncModal: (show: boolean) => void;
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
  const [showFavoritesSyncModal, setShowFavoritesSyncModal] = useState(false);
  const [localFavoritesCount, setLocalFavoritesCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token && authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
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

  // Check for local favorites when user logs in
  useEffect(() => {
    if (user) {
      checkLocalFavorites();
    }
  }, [user]);

  const checkLocalFavorites = () => {
    const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (localFavorites.length > 0) {
      setLocalFavoritesCount(localFavorites.length);
      setShowFavoritesSyncModal(true);
    }
  };

  const handleSyncAccept = async () => {
    setShowFavoritesSyncModal(false);
    await syncLocalFavorites();
  };

  const handleSyncDecline = () => {
    setShowFavoritesSyncModal(false);
    // Keep favorites in localStorage, don't sync to database
  };
  
  const syncLocalFavorites = async () => {
    // Only sync if user is authenticated
    if (!user) return;
    
    try {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (localFavorites.length > 0) {
        for (const property of localFavorites) {
          try {
            await favoritesAPI.add(property.id);
          } catch (error: any) {
            if (error.response?.status !== 400) {
              console.error('Error syncing favorite:', error);
            }
          }
        }
        // Only remove localStorage after successful sync
        localStorage.removeItem('favorites');
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
      // Don't remove localStorage on error to preserve data
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
        console.log('✅ User data refreshed:', userData.name);
      } catch (error) {
        console.error('❌ Failed to refresh user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const updateUserProfile = async (profileData: { name: string; phone?: string; avatar?: string }) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated() && !!user,
    logout,
    refreshAuth,
    updateUserProfile,
    discoveredSearches,
    showDiscoveryModal,
    setShowDiscoveryModal,
    showFavoritesSyncModal,
    setShowFavoritesSyncModal
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
      
      {/* Favorites Sync Modal */}
      <FavoritesSyncModal
        isOpen={showFavoritesSyncModal}
        onClose={() => setShowFavoritesSyncModal(false)}
        onAccept={handleSyncAccept}
        onDecline={handleSyncDecline}
        favoritesCount={localFavoritesCount}
      />
    </AuthContext.Provider>
  );
};