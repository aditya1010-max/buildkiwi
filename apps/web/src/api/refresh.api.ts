import axios from "axios";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  withCredentials: true,
});

export async function refreshAccessToken(): Promise<string> {
  const { data } = await refreshClient.post("/auth/refresh");

  return data.accessToken;
}
