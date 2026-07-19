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
    <div className="project-metadata__item">
      <div className="project-metadata__label">{label}</div>
      <div className="project-metadata__value">{value}</div>
    </div>
  );
}

export default function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <ProjectSection title="Project Information">
      <div className="project-metadata__list">
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
