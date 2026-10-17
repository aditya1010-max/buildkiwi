import api from "../services/api";

export const searchProjects = async (query: string) => {
  const response = await api.get("/search", {
    params: { q: query },
  });

  return response.data;
};
