import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_URL_BACKEND;

export const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 15000,
  withCredentials: true // Quan trọng: để gửi cookie refreshToken
});

// Flag để tránh gọi refresh nhiều lần cùng lúc
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - xử lý refresh token khi 401
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const response = await axiosClient.post('/auth/refresh-token');
        const newAccessToken = response.data.accessToken;

        localStorage.setItem("access-token", newAccessToken);

        processQueue(null, newAccessToken);

        // Retry request ban đầu với token mới
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        localStorage.removeItem("access-token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosClient.get<T>(url, config);
  },
  post: <T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosClient.post<T>(url, data, config);
  },
  put: <T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosClient.put<T>(url, data, config);
  },
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return axiosClient.delete<T>(url, config);
  }
};