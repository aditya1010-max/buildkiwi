import { useEffect, useState } from "react";

import { fetchProjects } from "../api/project.api";
import type { Project } from "../types/project";
import type { SearchFilter } from "../components/discover/SearchFilters";

export function useDiscover() {
  const [query, setQuery] = useState("");
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
          query,
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
  }, [query, filter]);

  return {
    projects,
    loading,
    error,

    query,
    setQuery,

    filter,
    setFilter,
  };
}
