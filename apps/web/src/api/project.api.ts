import axios from "axios";
import { Project } from "../types/project";
import { trackProgress } from "../services/progressBarManager";
import { getVisitorId } from "../services/visitor";

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

interface FetchProjectsOptions {
  page?: number;
  limit?: number;
  query?: string;
  filter?: "all" | "projects" | "users" | "tags";
}

export async function fetchProjects({
  page = 1,
  limit = 10,
  query,
  filter,
}: FetchProjectsOptions = {}) {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (query?.trim()) {
    params.q = query.trim();
  }

  if (filter && filter !== "all") {
    params.filter = filter;
  }

  const response = await trackProgress(
    axios.get<ProjectsResponse>(API, {
      params,
    }),
  );

  return response.data;
}

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

export async function recordProjectView(projectId: string) {
  await axios.post(
    `${API}/${projectId}/view`,
    {},
    {
      headers: {
        "X-Visitor-Id": getVisitorId(),
      },
    },
  );
}

export async function deleteProject(projectId: string) {
  const token = localStorage.getItem("token");

  const { data } = await trackProgress(
    axios.delete(`${API}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );

  return data;
}
