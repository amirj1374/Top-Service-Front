import axiosInstance from "@/services/axiosInstance";
import apiService from "@/services/apiService";
import userApi from "./modules/user";
import authApi from "./modules/auth";


export const api = {
  global: apiService(axiosInstance, "global"),
  user: userApi(axiosInstance),
  auth: authApi(axiosInstance),
};
