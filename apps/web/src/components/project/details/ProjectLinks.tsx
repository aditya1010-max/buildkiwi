import { Project } from "../../../types/project";

interface ProjectLinksProps {
  project: Project;
}

export default function ProjectLinks({ project }: ProjectLinksProps) {
  const { github, demo } = project.links;

  if (!github && !demo) return null;

  return (
    <section className="project-links">
      <h2>Project Links</h2>

      <div className="project-links__actions">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link-btn"
          >
            GitHub
          </a>
        )}

        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link-btn"
          >
            Live Demo
          </a>
        )}
      </div>
    </section>
  );
}
