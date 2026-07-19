import "./ProjectHero.css";
import { Project } from "../../../types/project";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const hasCover = Boolean(project.coverImage);

  return (
    <section className="project-hero">
      <div className="project-hero__cover">
        {hasCover ? (
          <img
            src={`http://localhost:3000/uploads/${project.coverImage}`}
            alt={project.title}
            className="project-hero__image"
          />
        ) : (
          <div className="project-hero__placeholder">
            <div className="project-hero__placeholder-box">
              <div className="project-hero__placeholder-frame" />

              <h3>No Cover Image</h3>

              <p>This project doesn't have a cover image yet.</p>
            </div>
          </div>
        )}
      </div>

      <div className="project-hero__content">
        <h1 className="project-hero__title">
          {project.title || "Untitled Project"}
        </h1>

        <div className="project-hero__meta">
          <span className="project-hero__creator">
            @{project.creatorId.username}
          </span>

          <span className="project-hero__separator">•</span>

          <span className="project-hero__date">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="project-hero__actions">
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-hero__button"
            >
              GitHub
            </a>
          ) : (
            <button disabled className="project-hero__button disabled">
              GitHub Unavailable
            </button>
          )}

          {project.links.demo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-hero__button project-hero__button--primary"
            >
              Live Demo
            </a>
          ) : (
            <button disabled className="project-hero__button disabled">
              Demo Unavailable
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
