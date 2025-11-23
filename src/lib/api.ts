import axios, { type AxiosProxyConfig, type AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND;

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 15000,
  withCredentials: true
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if(token) {
    config.headers.Authorization =  `Bearer ${token}`;
  }
  return config;
});

export const apiClient =  {
  request: {},
  get: (url: string, config?: AxiosProxyConfig) : Promise<AxiosResponse> => {
    return axiosClient.get(url, config);
  },
  post: (url: string, data?: object, config?: AxiosProxyConfig) : Promise<AxiosResponse> => {
    return axiosClient.post(url, data, config);
  },
  put: (url: string, data?: object, config?: AxiosProxyConfig) : Promise<AxiosResponse> => {
    return axiosClient.put(url, data, config);
  },
  delete: (url: string, config?: AxiosProxyConfig) : Promise<AxiosResponse> => {
    return axiosClient.delete(url, config);
  } 
};