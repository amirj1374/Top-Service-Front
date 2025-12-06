import { apiConfig } from '@/config/envConfig';
import type { AxiosInstance } from "axios";
import axiosInstance from './axiosInstance';

// Original apiService function (for backward compatibility)
export default (axiosInstance: AxiosInstance, resource: string) => ({
  fetch(filters?: Record<string, unknown>) {
    return axiosInstance.get(`api/v1/${resource}`, {
      params: { 
        ...filters,
      }
    });
  },

  create(data: Record<string, unknown>) {
    return axiosInstance.post(`api/v1/${resource}`, data);
  },  

  update(id: string | number, data: Record<string, unknown>) {
    if (!id) {
      throw new Error('ID is required for update operation');
    }
    return axiosInstance.put(`api/v1/${resource}/${id}`, data);
  },

  delete(id: string | Record<string, unknown>) {
    return axiosInstance.delete(`api/v1/${resource}/${id}`);
  },
});

// Centralized API service (new feature)
export const centralizedApiService = {
  // Base URL getter
  get baseURL() {
    return apiConfig.baseURL;
  },

  // User endpoints
  users: {
    getAll: () => axiosInstance.get('api/v1/users'),
    authenticate: (credentials: { username: string; password: string }) => 
      axiosInstance.post('api/v1/users/authenticate', credentials),
    logout: () => axiosInstance.post('api/v1/logout'),
  },

  // // Generic methods for other endpoints
  // get: (endpoint: string) => axiosInstance.get(endpoint),
  // post: (endpoint: string, data?: any) => axiosInstance.post(endpoint, data),
  // put: (endpoint: string, data?: any) => axiosInstance.put(endpoint, data),
  // delete: (endpoint: string) => axiosInstance.delete(endpoint),
};

// Export both for compatibility
export { centralizedApiService as apiService };

