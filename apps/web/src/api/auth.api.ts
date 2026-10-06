import type { User } from "../types/user";
import api from "../services/api";

interface ApiUser extends Omit<User, "id"> {
  _id: string;
}

function normalizeUser(user: User | ApiUser | null): User | null {
  if (!user) {
    return null;
  }

  if ("id" in user) {
    return user;
  }

  return {
    ...user,
    id: user._id,
  };
}

interface MeResponse {
  success: boolean;
  user: ApiUser | null;
}

interface RefreshResponse {
  success: boolean;
  accessToken: string;
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", data.accessToken);

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

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await api.post<RefreshResponse>("/auth/refresh");

    localStorage.setItem("token", data.accessToken);

    return data.accessToken;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  let token = localStorage.getItem("token");

  if (!token) {
    token = await refreshAccessToken();
  }

  if (!token) {
    return null;
  }

  try {
    const { data } = await api.get<MeResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.user ? normalizeUser(data.user) : null;
  } catch {
    localStorage.removeItem("token");

    return null;
  }
}

export async function logout() {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
}