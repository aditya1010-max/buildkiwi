import "./SavedProjectCard.css";

import { Link } from "react-router-dom";
import type { ReactElement } from "react";
import type { Project } from "../../types/project";

interface SavedProjectCardProps {
  project: Project;
}

export default function SavedProjectCard({
  project,
}: SavedProjectCardProps): ReactElement {
  return (
    <Link to={`/projects/${project._id}`} className="saved-project-card__link">
      <article className="saved-project-card">
        <div className="saved-project-card__top">
          <h3>{project.title}</h3>

          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="saved-project-card__creator">
          @{project.creatorId.username}
        </p>

        <p className="saved-project-card__description">{project.description}</p>

        {project.tags.length > 0 && (
          <div className="saved-project-card__tags">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
