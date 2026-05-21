import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔥 ATTACH TOKEN */
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* 🔥 HANDLE 401 UNAUTHORIZED GLOBALLY */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes("/auth/logout") && 
      !error.config.url.includes("/auth/login")
    ) {
      // Token is invalid/expired -> log user out
      useAuthStore.getState().logout();
      // Redirect to login if not already there
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;