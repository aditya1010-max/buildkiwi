import { User } from "../types/user";

const API = "http://localhost:3000/api/v1/auth";

import api from "../services/api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
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

  return data;
};

interface MeResponse {
  success: boolean;
  user: User;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const { data } = await api.get<MeResponse>(`${API}/me`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.user;
}

export async function logout() {
  await api.post("/auth/logout");
}
