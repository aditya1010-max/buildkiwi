import { useEffect, useState } from "react";

import { getUserProjects } from "../api/project.api";
import type { Project } from "../types/project";

export function useUserProjects(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const userProjects = await getUserProjects(userId);
        setProjects(userProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [userId]);

  return {
    projects,
    loading,
  };
}
