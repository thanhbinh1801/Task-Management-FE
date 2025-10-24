import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if(token) {
    config.headers.Authorization =  `Bearer ${token}`;
  }
  return config;
});