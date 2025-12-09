import axios, { type AxiosInstance } from "axios";
import type { CustomizerDTO, PersonDTO } from '@/types/models/person';
import type { UserInfoResponse } from '@/types/models/userInfo';

const userApi = (axiosInstance: AxiosInstance) => ({
  getCustomizer(): Promise<{ data: UserInfoResponse }> {
    return axiosInstance.get('api/users/me/customizer');
  },
  getDepartmentsLevel() {
    return axiosInstance.get("api/v1/department-role/levels");
  },
  fetch(page: number, limit: number) {
    return axiosInstance.get(`api/v1/person-requests`, { params: { page, limit } });
  },
  create(data: PersonDTO) {
    return axiosInstance.post("api/v1/personTransaction-requests", data);
  },
  update(id: string, data: PersonDTO) {
    return axiosInstance.put(`api/v1/personTransaction-requests/${id}`, data);
  },
  delete(id: string) {
    return axiosInstance.delete(`api/v1/personTransaction-requests/${id}`);
  },
  setCustomizer(data: { customizer: string }) {
    return axiosInstance.put(`api/users/me/customizer`, data);
  },
  getLoanRequestCount() {
    return axiosInstance.get(`api/v1/dashboard/loan-request-counts`);
  },
  getCartableCount() {
    return axiosInstance.get(`/api/v1/dashboard/cartable-status-counts`);
  }
});

export default userApi;
