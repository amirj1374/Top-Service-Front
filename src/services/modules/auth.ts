import { type AxiosInstance } from "axios";
import type { authPayload } from '@/types/models/auth';
import { apiConfig } from '@/config/envConfig';

const authApi = (axiosInstance: AxiosInstance) => ({
  getAccount() {
    return axiosInstance.get(`${apiConfig.baseURL}/account`);
  },
  getAuthenticate (data: authPayload){
    return axiosInstance.post('authenticate', data);
  },
});

export default authApi;
