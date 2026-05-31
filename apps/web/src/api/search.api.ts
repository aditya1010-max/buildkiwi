import axios from "axios";

export const searchProjects = async (query: string) => {
  const response = await axios.get(
    `http://localhost:3000/search?q=${encodeURIComponent(query)}`,
  );

  return response.data;
};
