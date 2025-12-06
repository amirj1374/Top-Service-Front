import envConfig, { apiConfig } from '@/config/envConfig';
import axios, { type AxiosInstance } from 'axios';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: 500000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Clear authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        // In demo mode, don't redirect on 401 - just let the error pass through
        if (envConfig.AUTH_MODE === 'demo') {
          return Promise.reject(error);
        }

        // Get router instance
        const { router } = await import('@/router');
        const currentPath = router.currentRoute.value.path;

        // Don't redirect if already on login page to avoid redirect loops
        if (currentPath === '/auth/login') {
          return Promise.reject(error);
        }

        // Handle different auth modes
        switch (envConfig.AUTH_MODE) {
          case 'keycloak':
          case 'initializer': {
            // For keycloak/initializer, redirect to OAuth endpoint
            window.location.href = 'back/oauth2/authorization/master';
            break;
          }
          case 'jwt':
          case 'dev':
          default: {
            // For JWT/dev/default, route to login page
            router.push('/auth/login');
            break;
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
