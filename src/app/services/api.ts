const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// Public API client without authentication
export const publicApiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {

    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    

    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('Public API Error Details:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        console.error('Raw response status:', response.status, response.statusText);
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  get: <T>(endpoint: string) => publicApiClient.request<T>(endpoint),
};

// Base API client with authentication
export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    

    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    

    
    if (response.status === 401) {
      // Token is invalid, clear storage and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Force page reload to update auth state
      window.location.reload();
      throw new Error('Authentication required. Please login again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  get: <T>(endpoint: string) => apiClient.request<T>(endpoint),
  
  post: <T>(endpoint: string, data?: any) => 
    apiClient.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data?: any) => 
    apiClient.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    apiClient.request<T>(endpoint, {
      method: 'DELETE',
    }),
};

// Auth API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    apiClient.post<{ token: string; user: any }>('/auth/register', { name, email, password }),
  
  logout: () => apiClient.post('/auth/logout'),
  
  getProfile: () => apiClient.get<any>('/auth/profile'),

  validateToken: () => apiClient.get<any>('/auth/validate'),
};

// Services API endpoints
export const servicesAPI = {
  getAll: () => publicApiClient.get<any[]>('/services'), // Public endpoint
  
  getById: (id: string) => publicApiClient.get<any>(`/services/${id}`), // Public endpoint
  
  create: (data: any) => apiClient.post<any>('/services', data), // Requires auth
  
  update: (id: string, data: any) => apiClient.patch<any>(`/services/${id}`, data), // Requires auth
  
  delete: (id: string) => apiClient.delete(`/services/${id}`), // Requires auth
};

// Bookings API endpoints
export const bookingsAPI = {
  getAll: () => apiClient.get<any[]>('/bookings'),
  
  getById: (id: string) => apiClient.get<any>(`/bookings/${id}`),
  
  getMyBookings: () => apiClient.get<any>('/bookings/my-bookings'),
  
  create: (data: any) => apiClient.post<any>('/bookings', data),
  
  update: (id: string, data: any) => apiClient.patch<any>(`/bookings/${id}`, data),
  
  userUpdate: (id: string, data: any) => apiClient.patch<any>(`/bookings/${id}/user-update`, data),
  
  delete: (id: string) => apiClient.delete(`/bookings/${id}`),
  
  cancel: (id: string) => apiClient.patch<any>(`/bookings/${id}/cancel`),
  
  updateStatus: (id: string, status: string, notes?: string) => 
    apiClient.patch<any>(`/bookings/${id}/status`, { status, ...(notes && { notes }) }),
};

// Users API endpoints
export const usersAPI = {
  getAll: () => apiClient.get<any[]>('/users'),
  
  getById: (id: string) => apiClient.get<any>(`/users/${id}`),
  
  update: (id: string, data: any) => apiClient.patch<any>(`/users/${id}`, data),
  
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

// Admin API endpoints
export const adminAPI = {
  getDashboard: () => apiClient.get<any>('/admin/dashboard'),
  
  getStats: () => apiClient.get<any>('/admin/stats'),
  
  getOrders: () => apiClient.get<any[]>('/admin/orders'),
  
  updateOrderStatus: (id: string, status: string) => 
    apiClient.patch<any>(`/admin/orders/${id}/status`, { status }),
};
