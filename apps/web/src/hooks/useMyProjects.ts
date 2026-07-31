import { useEffect, useState } from "react";

import { getMyProjects } from "../api/project.api";
import { Project } from "../types/project";

export function useMyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const myProjects = await getMyProjects();
        setProjects(myProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return {
    projects,
    loading,
  };
}
