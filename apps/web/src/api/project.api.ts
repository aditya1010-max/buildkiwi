import axios from "axios";

const API = "http://localhost:3000/api/projects"; // similar imports via env like we did in the backend can be done here as well for better maintainability and flexibility

export const fetchProjects = async (page: number, limit: number) => {
  const response = await axios.get(API, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};
