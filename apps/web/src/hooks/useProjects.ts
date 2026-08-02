import { useCallback, useEffect, useState } from "react";
import { fetchProjectById, fetchProjects } from "../api/project.api";
import { Project } from "../types/project";

export const useProjects = (initialLimit = 10) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Split loading states for initial render vs paginating
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

        const response = await fetchProjects(pageToLoad, pagination.limit);

        setProjects((prev) =>
          pageToLoad === 1 ? response.data : [...prev, ...response.data],
        );
        setPagination(response.pagination);
      } catch (err) {
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

  // Fetch initial page on mount
  useEffect(() => {
    loadProjects(1);
  }, [loadProjects]);

  const loadMore = useCallback(async () => {
    // Prevent trigger if either loading state is active or no more items remain
    if (initialLoading || loadingMore || !pagination.hasMore) return;

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
    // Flag to prevent state updates if the hook unmounts or ID changes
    let isSubscribed = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError(null);
        setProject(null); // Reset state when ID changes

        const response = await fetchProjectById(id);

        if (isSubscribed) {
          setProject(response.data);
        }
      } catch (err) {
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
      loadProject();
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
