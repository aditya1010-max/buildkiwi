import axios from "axios";

const API = "http://localhost:3000/api/v1/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API}/login`, {
    email,
    password,
  });

  return response.data;
};
