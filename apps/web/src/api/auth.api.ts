import type { User } from "../types/user";
import api from "../services/api";
import { normalizeUser } from "../utils/normalizeUser";
import type { ApiUser } from "../utils/normalizeUser";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../utils/token";
import { refreshAccessToken } from "./refresh.api";

interface MeResponse {
  success: boolean;
  user: ApiUser | null;
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  setAccessToken(data.accessToken);

  return {
    ...data,
    user: normalizeUser(data.user),
  };
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const { data } = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  return {
    ...data,
    user: normalizeUser(data.user),
  };
};

export async function getCurrentUser(): Promise<User | null> {
  let token = getAccessToken();

  if (!token) {
    try {
      token = await refreshAccessToken();
      setAccessToken(token);
    } catch {
      return null;
    }
  }

  try {
    const { data } = await api.get<MeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.user ? normalizeUser(data.user) : null;
  } catch (error) {
    // Preserve the token on server/network failures.
    // A 401 is handled by the API interceptor when refresh is possible.
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 401
    ) {
      clearAccessToken();
    }

    return null;
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAccessToken();
    localStorage.removeItem("user");
  }
}
