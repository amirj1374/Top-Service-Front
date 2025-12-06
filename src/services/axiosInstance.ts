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
        // In demo mode, don't redirect on 401 - just let the error pass through
        if (envConfig.AUTH_MODE === 'demo') {
          return Promise.reject(error);
        }

        switch (envConfig.AUTH_MODE) {
          case 'keycloak': {
            window.location.href = 'back/oauth2/authorization/master';
            break;
          }
          case 'jwt': {
            const { router } = await import('@/router');
            if (router.currentRoute.value.path !== '/auth/login') {
              router.push('/auth/login');
            }
            break;
          }
          case 'initializer': {
            window.location.href = 'back/oauth2/authorization/master';
            break;
          }
          case 'dev': {
            const { router } = await import('@/router');
            if (router.currentRoute.value.path !== '/auth/login') {
              router.push('/auth/login');
            }
            break;
          }
          default: {
            const { router } = await import('@/router');
            if (router.currentRoute.value.path !== '/auth/login') {
              router.push('/auth/login');
            }
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
