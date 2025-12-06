import { type AxiosInstance } from "axios";
import type { authPayload, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/types/models/auth';
import { apiConfig } from '@/config/envConfig';

const authApi = (axiosInstance: AxiosInstance) => ({
  getAccount() {
    return axiosInstance.get(`${apiConfig.baseURL}/account`);
  },
  getAuthenticate (data: authPayload){
    return axiosInstance.post('authenticate', data);
  },
  register(data: RegisterRequest): Promise<{ data: RegisterResponse }> {
    return axiosInstance.post('api/auth/register', data);
  },
  login(data: LoginRequest): Promise<{ data: LoginResponse }> {
    return axiosInstance.post('api/auth/login', data);
  },
});

export default authApi;
