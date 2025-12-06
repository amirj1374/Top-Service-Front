import envConfig from '@/config/envConfig';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import { reinitializeApp } from '@/utils/samapAppInitializer';
import { defineStore } from 'pinia';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });
      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));

      if (envConfig.AUTH_MODE === 'initializer' || envConfig.AUTH_MODE === 'dev') {
        try {
          await reinitializeApp();
        } catch (error) {
          console.error('Failed to reinitialize after login:', error);
        }
      }

      // redirect to previous url or default to home page
      await router.push(this.returnUrl || '/approval');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      window.location.href = "back/logout"
    }
  }
});
