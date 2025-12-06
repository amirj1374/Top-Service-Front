import type { AuthMode, EnvConfig } from '@/types/models/env';

const normalizeAuthMode = (value: string | undefined): AuthMode => {
  const normalized = value?.trim().toLowerCase();
  switch (normalized) {
    case 'keycloak':
    case 'initializer':
    case 'dev':
    case 'jwt':
    case 'demo':
      return normalized;
    default:
      return 'keycloak';
  }
};

// Debug: Log all available environment variables
console.log('🔍 Available VITE environment variables:', {
  VITE_PORT: import.meta.env.VITE_PORT,
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
});

// Simple configuration - just read from environment files
const envConfig: EnvConfig = {
  PORT: parseInt(import.meta.env.VITE_PORT),
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  ENVIRONMENT: import.meta.env.VITE_APP_ENV,
  AUTH_MODE: normalizeAuthMode(import.meta.env.VITE_AUTH_MODE)
};

// Simple API configuration
export const apiConfig = {
  baseURL: envConfig.API_BASE_URL || 'http://localhost:3000'
};

// Show current environment info
console.log('🌍 Current Environment:', {
  environment: envConfig.ENVIRONMENT,
  apiBaseUrl: envConfig.API_BASE_URL,
  baseUrl: envConfig.BASE_URL,
  appTitle: envConfig.APP_TITLE,
  port: envConfig.PORT,
  authMode: envConfig.AUTH_MODE
});

export default envConfig;
