import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const propertiesAPI = {
  getAll: (params?: any) => api.get('/properties', { params }),
  getById: (id: string) => api.get(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured/list'),
  getArchived: (params?: any) => api.get('/properties/archive', { params }),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

export const agentsAPI = {
  getAll: () => api.get('/agents'),
  getById: (id: string) => api.get(`/agents/${id}`),
  getProperties: (id: string) => api.get(`/agents/${id}/properties`),
  addReview: (id: string, data: any) => api.post(`/agents/${id}/review`, data),
  getReviews: (id: string) => api.get(`/agents/${id}/reviews`),
};

export const developersAPI = {
  getAll: () => api.get('/developers'),
  getById: (id: string) => api.get(`/developers/${id}`),
  getProperties: (id: string) => api.get(`/developers/${id}/properties`),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (propertyId: string) => api.post('/favorites', { propertyId }),
  remove: (propertyId: string) => api.delete(`/favorites/${propertyId}`),
  check: (propertyId: string) => api.get(`/favorites/check/${propertyId}`),
};

export const inquiriesAPI = {
  submit: (data: any) => api.post('/inquiries', data),
  getAll: () => api.get('/inquiries'),
  getById: (id: string) => api.get(`/inquiries/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/inquiries/${id}`, { status }),
  delete: (id: string) => api.delete(`/inquiries/${id}`),
};

export const notificationsAPI = {
  getAll: (params?: { type?: string; unread?: boolean }) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
  getById: (id: string) => api.get(`/notifications/${id}`),
};

export const locationsAPI = {
  getAll: () => api.get('/locations'),
  getById: (id: string) => api.get(`/locations/${id}`),
};

export const careersAPI = {
  getAll: () => api.get('/careers'),
  getById: (id: string) => api.get(`/careers/${id}`),
  apply: (id: string, data: any) => api.post(`/careers/${id}/apply`, data),
};

export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getProperties: () => api.get('/analytics/properties'),
  getMarket: () => api.get('/analytics/market'),
};