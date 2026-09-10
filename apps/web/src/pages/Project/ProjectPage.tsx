import "./projectPage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ProjectHero,
  ProjectOverview,
  ProjectMetadata,
} from "../../components/projects/details";

import type { Project } from "../../types/project";
import { fetchProjectById, recordProjectView } from "../../api/project.api";

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

        recordProjectView(id).catch((error) => {
          console.error("Failed to record project view", error);
        });
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
