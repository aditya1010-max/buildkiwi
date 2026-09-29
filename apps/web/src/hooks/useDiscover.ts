import { useEffect, useState } from "react";

import { fetchProjects } from "../api/project.api";
import type { Project } from "../types/project";
import type { SearchFilter } from "../components/discover/search/SearchFilters";

export function useDiscover(initialQuery = "") {
  const [filter, setFilter] = useState<SearchFilter>("all");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchProjects() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchProjects({
          query: initialQuery,
          filter,
        });

        setProjects(response.data);
      } catch {
        setError("Failed to search projects.");
      } finally {
        setLoading(false);
      }
    }

    searchProjects();
  }, [initialQuery, filter]);

  return {
    projects,
    loading,
    error,
    filter,
    setFilter,
  };
}
