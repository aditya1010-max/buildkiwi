import "./ProjectCard.css";

import type { Project } from "../../types/project";
import type { ReactElement } from "react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps): ReactElement {
  return (
    <article className="project-card">
      <header className="project-card__header">
        <div className="project-card__meta">
          <span className="project-card__creator">
            {project.creatorId.username}
          </span>

          <span className="project-card__time">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <h2 className="project-card__title">{project.title}</h2>

      <p className="project-card__description">{project.description}</p>

      <div className="project-card__stats">
        {" "}
        //change these eventually to actual svg logo
        <span>❤️ {project.stats.likes}</span>
        <span>💬 {project.stats.comments}</span>
        <span>👁️ {project.stats.views}</span>
      </div>

      {project.tags?.length > 0 && (
        <div className="project-card__tags">
          {project.tags.map((tag: string) => (
            <span key={tag} className="project-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
