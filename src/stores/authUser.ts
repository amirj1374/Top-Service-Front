import { defineStore } from 'pinia';

import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import type { UserInfoResponse } from '@/types/models/userInfo';

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const useUsersStore = defineStore({
  id: 'Authuser',
  state: () => ({
    users: {},
    currentUserInfo: null as UserInfoResponse | null
  }),
  actions: {
    async getAll() {
      this.users = { loading: true };
      fetchWrapper
        .get(baseUrl)
        .then((users) => (this.users = users))
        .catch((error) => (this.users = { error }));
    },
    setUserInfo(userInfo: UserInfoResponse) {
      this.currentUserInfo = userInfo;
    },
    clearUserInfo() {
      this.currentUserInfo = null;
    }
  }
});
