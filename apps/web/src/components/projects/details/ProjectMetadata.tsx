import "./ProjectMetadata.css";

import type { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";

import { HeartIcon, ViewIcon } from "../../../assets/icons/ProjectCardIcons";

interface ProjectMetadataProps {
  project: Project;
}

export default function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <ProjectSection title="Project Information">
      <div className="project-metadata">
        <span className="project-metadata_item">
          <HeartIcon size={24} />
          {project.stats.likes.toLocaleString()}
        </span>

        <span className="project-metadata_item">
          <ViewIcon size={24} />
          {project.stats.views.toLocaleString()}
        </span>
      </div>
    </ProjectSection>
  );
}
