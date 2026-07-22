import api from "../services/api";

export async function refreshAccessToken() {
  const { data } = await api.post("/auth/refresh");

  return data.accessToken;
}