import { useEffect, useState } from "react";
import { fetchProjectById, fetchProjects } from "../api/project.api";
import { Project } from "../types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetchProjects(1, 10);

        setProjects(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError("failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    pagination,
  };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLaoding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        setLaoding(true);

        const response = await fetchProjectById(id);

        setProject(response.data);
      } catch (err) {
        setError("failed to load project");
      } finally {
        setLaoding(false);
      }
    }

    loadProject();
  }, [id]);

  return {
    project,
    loading,
    error,
  };
};
