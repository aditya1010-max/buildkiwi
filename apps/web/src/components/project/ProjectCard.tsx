import "./ProjectCard.css";

import type { Project } from "../../types/project";
import type { JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps): ReactElement {
  return (
    <article className="project-card">
      <header className="project-card__header">
        <div className="project-card__meta">
          <span className="project-card__creator">
            {project._id ?? "Unknown"}
          </span>

          <span className="project-card__time">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <h2 className="project-card__title">{project.title}</h2>

      <p className="project-card__description">{project.description}</p>

      {project.tags?.length > 0 && (
        <div className="project-card__tags">
          {project.tags.map((tag: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined) => (
            <span key={String(tag)} className="project-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
