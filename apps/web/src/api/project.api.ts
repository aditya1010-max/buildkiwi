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

export interface SingleProjectResponse {
  success: boolean;
  data: Project;
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

export const fetchProjectById = async (
  id: string,
): Promise<SingleProjectResponse> => {
  const response = await axios.get<SingleProjectResponse>(`${API}/${id}`);
  return response.data;
};

export async function saveProject(projectId: string) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API}/${projectId}/save`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function unsaveProject(projectId: string) {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API}/${projectId}/save`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getSavedProjects() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/saved`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}
