import "./ProjectPage.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import {
  ProjectHero,
  ProjectOverview,
} from "../../components/projects/details";

import type { Project } from "../../types/project";
import { fetchProjectById, recordProjectView } from "../../api/project.api";

import CommentsSection from "../../components/comments/CommentSection";
import Loader from "../../components/ui/Loader";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

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
      } catch (error) {
        console.error("Failed to fetch project", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="project-page">
        <Loader size="lg" />
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

      <CommentsSection
        projectId={project._id}
        projectOwnerId={project.creatorId._id}
        currentUserId={user?._id}
      />
    </main>
  );
}
