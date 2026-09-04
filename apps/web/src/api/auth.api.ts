import type { User } from "../types/user";

import api from "../services/api";

const API = "http://localhost:3000/api/v1/auth";

interface ApiUser extends Omit<User, "id"> {
  _id: string;
}

function normalizeUser(user: User | ApiUser): User {
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
  user: ApiUser;
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

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

export async function getCurrentUser(): Promise<User> {
  const token = localStorage.getItem("token");

  const { data } = await api.get<MeResponse>(`${API}/me`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return normalizeUser(data.user);
}

export async function logout() {
  await api.post("/auth/logout");
}
