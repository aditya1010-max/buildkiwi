import "./ProjectCard.css";

import type { Project } from "../../types/project";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
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

      <h2 className="project-card__title">{project.data.title}</h2>

      <p className="project-card__description">{project.data.description}</p>

      {project.data.tags.length > 0 && (
        <div className="project-card__tags">
          {project.data.tags.map((tag) => (
            <span key={tag} className="project-card__tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
