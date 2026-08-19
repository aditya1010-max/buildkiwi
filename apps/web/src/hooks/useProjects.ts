import { useCallback, useEffect, useState } from "react";
import { fetchProjectById, fetchProjects } from "../api/project.api";
import type { Project } from "../types/project";

export const useProjects = (initialLimit = 10) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
    hasMore: false,
  });

  const loadProjects = useCallback(
    async (pageToLoad: number) => {
      try {
        if (pageToLoad === 1) {
          setInitialLoading(true);
        } else {
          setLoadingMore(true);
        }

        setError(null);

        const response = await fetchProjects({
          page: pageToLoad,
          limit: pagination.limit,
        });

        setProjects((prev) =>
          pageToLoad === 1 ? response.data : [...prev, ...response.data],
        );

        setPagination(response.pagination);
      } catch {
        setError("Failed to load projects.");
      } finally {
        if (pageToLoad === 1) {
          setInitialLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [pagination.limit],
  );

  useEffect(() => {
    const loadInitialProjects = async () => {
      await loadProjects(1);
    };

    void loadInitialProjects();
  }, [loadProjects]);

  const loadMore = useCallback(async () => {
    if (initialLoading || loadingMore || !pagination.hasMore) {
      return;
    }

    await loadProjects(pagination.page + 1);
  }, [
    initialLoading,
    loadingMore,
    pagination.hasMore,
    pagination.page,
    loadProjects,
  ]);

  const refresh = useCallback(() => {
    return loadProjects(1);
  }, [loadProjects]);

  return {
    projects,
    initialLoading,
    loadingMore,
    error,
    pagination,
    loadMore,
    refresh,
  };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError(null);
        setProject(null);

        const response = await fetchProjectById(id);

        if (isSubscribed) {
          setProject(response.data);
        }
      } catch {
        if (isSubscribed) {
          setError("Failed to load project.");
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    }

    if (id) {
      void loadProject();
    }

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  return {
    project,
    loading,
    error,
  };
};
