import "./ProjectMetadata.css";
import { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";
interface ProjectMetadataProps {
  project: Project;
}

function MetadataItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
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
        ...
      </div>
    </ProjectSection>
  );
}
