import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
  exp: number;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    
    if (this.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    // Add request interceptor for automatic token refresh
    axios.interceptors.request.use(async (config) => {
      if (this.shouldRefreshToken()) {
        await this.refreshTokens();
      }
      return config;
    });
    
    // Add response interceptor to handle token errors
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && error.response?.data?.error === 'TOKEN_EXPIRED') {
          try {
            await this.refreshTokens();
            // Retry original request
            return axios.request(error.config);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }
        if (error.response?.status === 403 || error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private shouldRefreshToken(): boolean {
    if (!this.accessToken || !this.refreshToken) return false;
    
    try {
      const decoded = jwtDecode<TokenPayload>(this.accessToken);
      const now = Date.now() / 1000;
      // Refresh if token expires in next 2 minutes
      return decoded.exp - now < 120;
    } catch {
      return true;
    }
  }

  private async refreshTokens(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._refreshTokens();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _refreshTokens(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: this.refreshToken
      });
      
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      console.log('⚙️ Attempting login for:', credentials.email);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Login successful for:', credentials.email);
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      
      // Enhanced error handling
      if (error.response?.status === 401) {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'بيانات غير صحيحة');
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً');
      }
      
      throw new Error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data.user;
  }

  async updateProfile(userData: {
    name: string;
    phone?: string;
    avatar?: string;
  }): Promise<User> {
    console.log('🔄 Updating profile:', userData);
    const response = await axios.put(`${API_URL}/auth/profile`, userData);
    console.log('✅ Profile updated successfully');
    return response.data.user;
  }

  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Don't remove favorites - let users keep their guest favorites
    delete axios.defaults.headers.common['Authorization'];
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  isAuthenticated(): boolean {
    if (!this.accessToken || !this.refreshToken) return false;
    
    try {
      const decoded = jwtDecode<TokenPayload>(this.refreshToken);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

export const authService = new AuthService();