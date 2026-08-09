import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectManagerCard.css";

import type { Project } from "../../../types/project";
import { deleteProject } from "../../../api/project.api";
import DeleteProjectDialog from "../../../components/userMenu/dialogs/DeleteProjectDialog";

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

  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <article className="project-manager-card">
      {/* Cover */}
      <div className="project-manager-card_cover">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="project-manager-card_image"
          />
        ) : (
          <div className="project-manager-card_placeholder">No Cover Image</div>
        )}
      </div>

      {/* Content */}
      <div className="project-manager-card_content">
        <h2 className="project-manager-card_title">{project.title}</h2>

        <p className="project-manager-card_description">
          {project.description}
        </p>

        <div className="project-manager-card_meta">
          <span>Created {formatDate(project.createdAt)}</span>
          <span>Updated {formatDate(project.updatedAt)}</span>
        </div>

        <div className="project-manager-card_stats">
          <span>
            <span role="img" aria-label="views">
              👁
            </span>{" "}
            {project.stats.views}
          </span>
          <span>
            <span role="img" aria-label="likes">
              ❤️
            </span>{" "}
            {project.stats.likes}
          </span>
          <span>
            <span role="img" aria-label="comments">
              💬
            </span>{" "}
            {project.stats.comments}
          </span>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="project-manager-card_tags">
            {[...new Set(project.tags)].map((tag) => (
              <span key={tag} className="project-manager-card_tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <footer className="project-manager-card_actions">
        <button onClick={() => navigate(`/projects/${project._id}`)}>
          View
        </button>

        <button onClick={() => navigate(`/projects/${project._id}/edit`)}>
          Edit
        </button>

        <button onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button disabled>Analytics</button>
      </footer>
      {showDeleteDialog && (
        <DeleteProjectDialog
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </article>
  );
}
