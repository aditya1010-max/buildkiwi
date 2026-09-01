import type { ReactElement } from "react";
import type { Project } from "../../../../types/project";

import "./ProjectHeader.css";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({
  project,
}: ProjectHeaderProps): ReactElement {
  return (
    <header className="project-card_header">
      <div className="project-card_creator">
        <div
          className="project-card_avatar"
          aria-hidden="true"
        />

        <div className="project-card_meta">
          <span className="project-card_username">
            {project.creatorId?.username ?? "Unknown"}
          </span>

          <span className="project-card_time">
            {project.createdAt
              ? new Date(
                  project.createdAt,
                ).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    </header>
  );
}