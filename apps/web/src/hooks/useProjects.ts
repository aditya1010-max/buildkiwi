import { useEffect, useState } from "react";
import { fetchProjects } from "../api/project.api";
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
