import type { ReactElement } from "react";
import type { Project } from "../../../../types/project";

import Badge from "../../../ui/Badge";
import "./ProjectTags.css";

interface ProjectTagsProps {
  project: Project;
}

export default function ProjectTags({
  project,
}: ProjectTagsProps): ReactElement | null {
  if (!project.tags || project.tags.length === 0) {
    return null;
  }

  const uniqueTags = [...new Set(project.tags)];

  return (
    <div className="project-card_tags">
      {uniqueTags.map((tag) => (
        <Badge key={tag} className="project-card_tag">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
