import { defineStore } from 'pinia';
import type { UserInfoResponse } from '@/types/models/userInfo';

export const useCustomerInfoStore = defineStore({
  id: 'customerInfo',
  state: () => ({
    userInfo: null as UserInfoResponse | null,
    isLoading: false,
    error: null as string | null
  }),
  
  getters: {
    // Get user info
    getUserInfo: (state) => state.userInfo,
    
    // Check if user info is loaded
    isUserInfoLoaded: (state) => state.userInfo !== null,
    
    // Get user name
    getUserName: (state) => state.userInfo?.fullName || '',
    
    // Get username
    getUsername: (state) => state.userInfo?.username || '',
    
    // Get branch info
    getBranchInfo: (state) => ({
      name: state.userInfo?.branchName || '',
      code: state.userInfo?.branchCode || ''
    }),
    
    // Get user position
    getUserPosition: (state) => state.userInfo?.position || '',
    
    // Get user roles
    getUserRoles: (state) => state.userInfo?.roles || [],
    
    // Get lotus roles
    getLotusRoles: (state) => state.userInfo?.lotusRoles || [],
    
    // Check if user has specific role
    hasRole: (state) => (roleName: string) => {
      return state.userInfo?.roles?.includes(roleName) || false;
    },
    
    // Check if user has specific lotus role
    hasLotusRole: (state) => (roleName: string) => {
      return state.userInfo?.lotusRoles?.includes(roleName) || false;
    }
  },
  
  actions: {
    // Set user info
    setUserInfo(userInfo: UserInfoResponse) {
      this.userInfo = userInfo;
      this.error = null;
    },
    
    // Clear user info
    clearUserInfo() {
      this.userInfo = null;
      this.error = null;
    },
    
    // Set loading state
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    
    // Set error
    setError(error: string) {
      this.error = error;
      this.isLoading = false;
    },
    
    // Clear error
    clearError() {
      this.error = null;
    }
  }
}); 