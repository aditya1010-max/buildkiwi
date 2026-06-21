import axios from "axios";
import { Project } from "../types/project";

const API = "http://localhost:3000/api/v1/projects";

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const fetchProjects = async (
  page: number,
  limit: number,
): Promise<ProjectsResponse> => {
  const response = await axios.get<ProjectsResponse>(API, {
    params: { page, limit },
  });

  return response.data;
};
