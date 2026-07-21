import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectManagerCard.css";

import type { Project } from "../../../types/project";

interface ProjectManagerCardProps {
  project: Project;
}

export default function ProjectManagerCard({
  project,
}: ProjectManagerCardProps): ReactElement {
  const navigate = useNavigate();

  return (
    <article className="project-manager-card">
      {/* Cover */}
      <div className="project-manager-card__cover">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="project-manager-card__image"
          />
        ) : (
          <div className="project-manager-card__placeholder">
            No Cover Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="project-manager-card__content">
        <h2 className="project-manager-card__title">{project.title}</h2>

        <p className="project-manager-card__description">
          {project.description}
        </p>

        <div className="project-manager-card__meta">
          <span>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>

          <span>
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="project-manager-card__stats">
          <span>👁 {project.stats.views}</span>
          <span>❤️ {project.stats.likes}</span>
          <span>💬 {project.stats.comments}</span>
        </div>

        {project.tags.length > 0 && (
          <div className="project-manager-card__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-manager-card__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <footer className="project-manager-card__actions">
        <button onClick={() => navigate(`/projects/${project._id}`)}>
          View
        </button>

        <button onClick={() => navigate(`/projects/${project._id}/edit`)}>
          Edit
        </button>

        <button disabled>Analytics</button>
      </footer>
    </article>
  );
}
