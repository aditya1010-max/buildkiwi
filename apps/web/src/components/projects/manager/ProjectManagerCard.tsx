import { type ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectManagerCard.css";

import type { Project } from "../../../types/project";
import { deleteProject } from "../../../api/project.api";
import DeleteProjectDialog from "../../user-menu/dialogs/DeleteProjectDialog";
import Card from "../../ui/Card";
import GeneratedCover from "../shared/GeneratedCover/GeneratedCover";

interface ProjectManagerCardProps {
  project: Project;
  onDeleteSuccess?: (projectId: string) => void;
}

export default function ProjectManagerCard({
  project,
  onDeleteSuccess,
}: ProjectManagerCardProps): ReactElement {
  const navigate = useNavigate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await deleteProject(project._id);
      setShowDeleteDialog(false);

      if (onDeleteSuccess) {
        onDeleteSuccess(project._id);
      } else {
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="project-manager-card">
      <button
        type="button"
        className="project-manager-card_cover"
        onClick={() => navigate(`/projects/${project._id}`)}
        aria-label={`View ${project.title}`}
      >
        <GeneratedCover
          seed={project.coverSeed ?? project._id}
          className="project-manager-card_generated-cover"
        />
      </button>

      <div className="project-manager-card_content">
        <h2 className="project-manager-card_title">{project.title}</h2>

        <p className="project-manager-card_description">
          {project.description || "No description provided."}
        </p>
      </div>

      <footer className="project-manager-card_actions">
        <button
          type="button"
          onClick={() => navigate(`/projects/${project._id}`)}
        >
          View
        </button>

        <button
          type="button"
          onClick={() => navigate(`/projects/${project._id}/edit`)}
        >
          Edit
        </button>

        <button
          type="button"
          className="project-manager-card_delete"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </footer>

      {showDeleteDialog && (
        <DeleteProjectDialog
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </Card>
  );
}