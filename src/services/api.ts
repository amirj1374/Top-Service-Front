import axiosInstance from "@/services/axiosInstance";
import apiService from "@/services/apiService";
import userApi from "./modules/user";


export const api = {
  global: apiService(axiosInstance, "global"),
  user: userApi(axiosInstance),
};
