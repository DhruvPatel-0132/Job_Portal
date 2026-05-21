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
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/auth/logout") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          // Use axios directly to avoid interceptor loop
          const res = await axios.post("http://localhost:5000/api/auth/refresh-token", {
            refreshToken,
          });

          if (res.data.success) {
            const { accessToken } = res.data;
            useAuthStore.getState().setToken(accessToken);

            // Update header and retry
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Auto-refresh failed:", refreshError);
          useAuthStore.getState().logout();
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;