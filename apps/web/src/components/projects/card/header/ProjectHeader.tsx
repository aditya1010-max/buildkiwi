import type { ReactElement, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { Project } from "../../../../types/project";

import GeneratedAvatar from "../../shared/GeneratedAvatar/GeneratedAvatar";

import "./ProjectHeader.css";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({
  project,
}: ProjectHeaderProps): ReactElement {
  const navigate = useNavigate();

  function handleCreatorClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    navigate(`/profile/${project.creatorId.username}`);
  }

  return (
    <header className="project-card_header">
      <div
        className="project-card_creator"
        onClick={handleCreatorClick}
        role="link"
        tabIndex={0}
      >
        <GeneratedAvatar
          seed={project.creatorId.avatarSeed}
          pattern={project.creatorId.avatarPattern}
          className="project-card_avatar"
        />

        <div className="project-card_meta">
          <span className="project-card_username">
            {project.creatorId.username}
          </span>

          <span className="project-card_time">
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    </header>
  );
}
