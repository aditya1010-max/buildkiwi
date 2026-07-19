import "./ProjectLinks.css";
import { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";
interface ProjectLinksProps {
  project: Project;
}

export default function ProjectLinks({ project }: ProjectLinksProps) {
  const resources = [
    {
      title: "GitHub Repository",
      description: "View the source code.",
      href: project.links.github,
    },
    {
      title: "Live Demo",
      description: "Open the deployed application.",
      href: project.links.demo,
    },
  ];

  return (
    <ProjectSection title="Resources">
      <div className="project-links__list">
        {resources.map((resource) =>
          resource.href ? (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="project-links__item"
            >
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </a>
          ) : (
            <div
              key={resource.title}
              className="project-links__item project-links__item--disabled"
            >
              <h3>{resource.title}</h3>
              <p>Unavailable</p>
            </div>
          ),
        )}
      </div>
    </ProjectSection>
  );
}
