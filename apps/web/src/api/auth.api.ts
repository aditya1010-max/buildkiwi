import axios from "axios";
import { User } from "../types/user";

const API = "http://localhost:3000/api/v1/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });

  return response.data;
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.post(`${API}/register`, {
    username,
    email,
    password,
  });

  return response.data;
};

interface MeResponse {  // This interface represents the response from the /me endpoint 
  success: boolean;    // we can define it globally in a types file if needed
  user: User;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const response = await axios.get<MeResponse>(`${API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
}
