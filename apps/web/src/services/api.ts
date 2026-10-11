import axios, { type InternalAxiosRequestConfig } from "axios";
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
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Do not attempt refresh for authentication endpoints.
    const url = originalRequest.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    if (isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Without an access token, session restoration must be handled
    // by the authentication initialization flow.
    if (!getAccessToken()) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      setAccessToken(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      // Only clear the session when the refresh token is actually
      // rejected. Network errors and server errors are not proof
      // that the session has expired.
      const status = axios.isAxiosError(refreshError)
        ? refreshError.response?.status
        : undefined;

      if (status === 401 || status === 403) {
        clearAccessToken();
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
