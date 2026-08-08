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
          <span>
            Created {new Date(project.createdAt).toLocaleDateString()}
          </span>

          <span>
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="project-manager-card_stats">
          <span>👁 {project.stats.views}</span>
          <span>❤️ {project.stats.likes}</span>
          <span>💬 {project.stats.comments}</span>
        </div>

        {project.tags.length > 0 && (
          <div className="project-manager-card_tags">
            {project.tags.map((tag) => (
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

        <button disabled>Analytics</button>
      </footer>
    </article>
  );
}
