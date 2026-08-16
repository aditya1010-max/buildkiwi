import axios, { InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../utils/token";
import { refreshAccessToken } from "../api/refresh.api";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically refresh expired access tokens
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryRequestConfig;
    const currentToken = getAccessToken();

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Guest browsing
    if (!currentToken) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Get a fresh access token
      const newAccessToken = await refreshAccessToken();

      // Save it
      setAccessToken(newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.count("REFRESH FAILED");

      clearAccessToken();
      localStorage.removeItem("user");
      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);

export default api;
