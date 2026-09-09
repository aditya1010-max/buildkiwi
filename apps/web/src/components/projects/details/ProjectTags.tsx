import "./ProjectTags.css";

import type { Project } from "../../../types/project";
import Badge from "../../ui/Badge";
import ProjectSection from "../shared/ProjectSection";

interface ProjectTagsProps {
  project: Project;
}

export default function ProjectTags({ project }: ProjectTagsProps) {
  const tags = [...new Set(project.tags ?? [])];

  return (
    <ProjectSection title="Technologies">
      {tags.length > 0 ? (
        <div className="project-tags">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      ) : (
        <div className="project-tags_empty">
          <h3>No Technologies Added</h3>
          <p>The project owner hasn't added any technologies yet.</p>
        </div>
      )}
    </ProjectSection>
  );
}
