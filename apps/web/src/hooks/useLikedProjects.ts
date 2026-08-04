import { useEffect, useState } from "react";

import { fetchLikedProjects } from "../api/like.api";
import type { Project } from "../types/project";

export function useLikedProjects() {
  const [likedProjects, setLikedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLikedProjects() {
      try {
        const projects = await fetchLikedProjects();
        setLikedProjects(projects);
      } catch (error) {
        console.error("Failed to fetch liked projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLikedProjects();
  }, []);

  return {
    likedProjects,
    loading,
  };
}
