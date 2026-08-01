import axios from "axios";
import { Project } from "../types/project";
import { trackProgress } from "../services/progressBarManager";

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
  const response = await trackProgress(
    axios.get<ProjectsResponse>(API, {
      params: { page, limit },
    }),
  );

  return response.data;
};

export const fetchProjectById = async (
  id: string,
): Promise<SingleProjectResponse> => {
  const response = await trackProgress(
    axios.get<SingleProjectResponse>(`${API}/${id}`),
  );
  return response.data;
};

export async function getSavedProjects() {
  const token = localStorage.getItem("token");

  const response = await trackProgress(
    axios.get(`${API}/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return response.data.data;
}

export async function getEditableProject(projectId: string) {
  const token = localStorage.getItem("token");

  const response = await trackProgress(
    axios.get(`${API}/${projectId}/edit`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return response.data.data;
}

export async function updateProject(projectId: string, formData: FormData) {
  const token = localStorage.getItem("token");

  const { data } = await trackProgress(
    axios.patch(`${API}/${projectId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return data;
}

export async function createProject(formData: FormData) {
  const token = localStorage.getItem("token");

  const { data } = await trackProgress(
    axios.post(API, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return data;
}

export async function getMyProjects() {
  const token = localStorage.getItem("token");

  const { data } = await trackProgress(
    axios.get(`${API}/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return data.data;
}

export async function getProjects() {
  const response = await trackProgress(axios.get("/projects"));

  return response.data;
}
