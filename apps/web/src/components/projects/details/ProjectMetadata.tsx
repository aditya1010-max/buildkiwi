import "./ProjectMetadata.css";

import type { ReactNode } from "react";

import type { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";

interface ProjectMetadataProps {
  project: Project;
}

interface MetadataItemProps {
  label: string;
  value: ReactNode;
}

function MetadataItem({ label, value }: MetadataItemProps) {
  return (
    <div className="project-metadata_item">
      <div className="project-metadata_label">{label}</div>

      <div className="project-metadata_value">{value}</div>
    </div>
  );
}

export default function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <ProjectSection title="Project Information">
      <div className="project-metadata_list">
        <MetadataItem
          label="Creator"
          value={`@${project.creatorId.username}`}
        />

        <MetadataItem
          label="Views"
          value={project.stats.views.toLocaleString()}
        />
      </div>
    </ProjectSection>
  );
}
