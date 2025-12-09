// Core Vue and dependencies
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { router } from './router';

// Plugins
import VueApexCharts from 'vue3-apexcharts';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker';
import print from 'vue3-print-nb';

// Directives
import DigitLimit from '@/directives/v-digit-limit';
import { vPermission } from '@/directives/v-permission';

// Styles
import '@/scss/style.scss';

// Services and utilities
import envConfig from '@/config/envConfig';
import { api } from '@/services/api';
import { initializeApp, startInitialization } from '@/utils/samapAppInitializer';
import { setupKeycloak } from './plugins/key-clock';

// Types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Keycloak types may not be available in all environments
import type { VueKeycloakInstance } from '@dsb-norge/vue-keycloak-js';


// Create app instance
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

// Get authentication mode
const authMode = envConfig.AUTH_MODE ?? 'keycloak';

/**
 * Logger utility - only logs in development
 */
const logger = {
  log: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  }
};

/**
 * Handles JWT authentication mode
 * Fetches user info and stores it in auth store
 */
async function handleJwtAuth(): Promise<void> {
  try {
    const response = await api.user.getCustomizer();
    if (response?.data) {
      const { useCustomizerStore } = await import('@/stores/customizer');
      const customizerStore = useCustomizerStore();

      // Ensure customizer is stored as parsed JSON (fallback to raw value on parse issues)
      const customizerValue = (() => {
        const raw = response.data.customizer;
        if (raw === undefined || raw === null) return null;
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw);
          } catch {
            return raw;
          }
        }
        return raw;
      })();

      if (customizerValue && typeof customizerValue === 'object') {
        customizerStore.fontTheme = customizerValue.fontTheme ?? customizerStore.fontTheme;
        customizerStore.inputBg = customizerValue.inputBg ?? customizerStore.inputBg;
        customizerStore.layoutType = customizerValue.layoutType ?? customizerStore.layoutType;
        customizerStore.actTheme = customizerValue.actTheme ?? customizerStore.actTheme;
        customizerStore.themeMode = customizerValue.themeMode ?? customizerStore.themeMode;
        customizerStore.menuOrientation = customizerValue.menuOrientation ?? customizerStore.menuOrientation;
      }

      logger.log('✅ Customizer loaded');
    }
  } catch (error: unknown) {
    // Only log non-401 errors (401 is expected for unauthenticated users)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status !== 401) {
        logger.warn('⚠️ JWT authentication failed:', error);
      }
    } else {
      logger.warn('⚠️ JWT authentication failed:', error);
    }
  }
}

/**
 * Handles initializer/dev authentication mode
 * Uses AppInitializer to fetch user data and initialize app
 */
async function handleInitializerAuth(): Promise<void> {
  logger.log('📱 Initializing app via AppInitializer...');

  const initPromise = initializeApp();
  const { useCustomizerStore } = await import('@/stores/customizer');
  const customizer = useCustomizerStore();
  customizer.SET_LOADING(true);

  try {
    await startInitialization();
    await initPromise;
    logger.log('✅ App initialization completed');
  } catch (error) {
    logger.error('❌ App initialization failed:', error);
    const { router } = await import('@/router');
    if (router.currentRoute.value.path !== '/auth/login') {
      router.push('/auth/login');
    }
    throw error; // Re-throw to stop bootstrap process
  }

  // Handle dev mode specific behavior
  if (authMode === 'dev') {
    logger.log('🔧 Dev mode: ensuring loading state is cleared');
    customizer.SET_LOADING(false);
    // Small delay to ensure state update is processed
    setTimeout(() => customizer.SET_LOADING(false), 100);
  }
}

/**
 * Handles demo authentication mode
 * No authentication required - app starts immediately without any auth checks
 */
async function handleDemoAuth(): Promise<void> {
  logger.log('🎭 Demo mode: Skipping authentication - app will start immediately');
  
  // Optionally set a demo user in the store for UI purposes
  try {
    const { useAuthStore } = await import('@/stores/auth');
    const { useCustomizerStore } = await import('@/stores/customizer');
    const authStore = useAuthStore();
    const customizer = useCustomizerStore();
    
    // Set a demo user if store is empty
    if (!authStore.user) {
      authStore.user = {
        id: 'demo-user',
        name: 'Demo User',
        username: 'demo'
      } as unknown;
      logger.log('✅ Demo user set in auth store');
    }
    
    // Ensure loading is false for demo mode
    customizer.SET_LOADING(false);
  } catch (error) {
    // Non-critical - just log if stores fail to load
    logger.warn('⚠️ Could not set demo user:', error);
  }
}

/**
 * Configures authentication based on auth mode
 */
async function configureAuthentication(): Promise<void> {
  logger.log('🔐 Configuring authentication with mode:', authMode);

  switch (authMode) {
    case 'keycloak':
      setupKeycloak(app);
      logger.log('✅ Keycloak authentication configured');
      break;

    case 'jwt':
      await handleJwtAuth();
      break;

    case 'initializer':
    case 'dev':
      await handleInitializerAuth();
      break;

    case 'demo':
      await handleDemoAuth();
      logger.log('✅ Demo mode activated - no authentication required');
      break;

    default:
      logger.warn('⚠️ Unknown auth mode, defaulting to keycloak');
      setupKeycloak(app);
  }
}

/**
 * Registers all Vue plugins and components
 */
function registerPlugins(): void {
  app.use(router);
  app.use(PerfectScrollbarPlugin);
  app.use(print);
  app.use(VueApexCharts);
  app.component('Vue3PersianDatetimePicker', Vue3PersianDatetimePicker);
}

/**
 * Registers custom directives
 */
function registerDirectives(): void {
  app.directive('digit-limit', DigitLimit);
  app.directive('permission', vPermission);
}

/**
 * Main bootstrap function
 * Initializes the application with proper error handling
 */
async function bootstrap(): Promise<void> {
  try {
    logger.log('🚀 Starting application bootstrap...');

    // Configure authentication
    await configureAuthentication();

    // Register plugins and directives
    registerPlugins();
    registerDirectives();

    // Mount the application
    app.use(vuetify).mount('#app');

    logger.log('✅ Application bootstrap completed successfully');
  } catch (error) {
    logger.error('❌ Bootstrap failed:', error);
    // Optionally show user-friendly error message
    // You could mount an error component here instead
    throw error;
  }
}

// Start the application
bootstrap().catch((error) => {
  logger.error('💥 Fatal bootstrap error:', error);
  // In production, you might want to show a user-friendly error page
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: Arial, sans-serif;">
      <h1 style="color: #f44336;">Application Failed to Load</h1>
      <p>Please refresh the page or contact support if the problem persists.</p>
      ${import.meta.env.DEV ? `<pre style="background: #f5f5f5; padding: 20px; border-radius: 4px; max-width: 800px; overflow: auto;">${error}</pre>` : ''}
    </div>
  `;
});

// TypeScript module augmentation for Keycloak
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance;
  }
}
