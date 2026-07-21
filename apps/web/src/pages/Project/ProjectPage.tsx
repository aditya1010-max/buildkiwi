import "./projectPage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ProjectHero,
  ProjectOverview,
  // ProjectSidebar,
  // ProjectDetailsLayout,
  ProjectMetadata,
} from "../../components/project/details";

import type { Project } from "../../types/project";
import { fetchProjectById } from "../../api/project.api";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const response = await fetchProjectById(id);
        setProject(response.data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="project-page">
        <h2>Loading...</h2>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="project-page">
        <h2>Project not found.</h2>
      </main>
    );
  }

  return (
    <main className="project-page">
      <ProjectHero project={project} />

      <ProjectOverview project={project} />

      <ProjectMetadata project={project} />
    </main>
  );
}
