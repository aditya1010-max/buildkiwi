import type { ReactElement } from "react";
import type { Project } from "../../../../types/project";

import "./ProjectContent.css";

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({
  project,
}: ProjectContentProps): ReactElement {
  return (
    <section className="project-card_content">
      <h2 className="project-card_title">
        {project.title}
      </h2>

      <p className="project-card_description">
        {project.description}
      </p>
    </section>
  );
}