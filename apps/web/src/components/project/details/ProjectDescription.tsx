import "./ProjectDescription.css";
import { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";

interface ProjectDescriptionProps {
  project: Project;
}

export default function ProjectDescription({
  project,
}: ProjectDescriptionProps) {
  const description = project.description?.trim();

  return (
    <ProjectSection title="Description">
      {description ? (
        <p className="project-description__content">{description}</p>
      ) : (
        <div className="project-description__empty">
          <h3>No Description</h3>

          <p>The project owner hasn't added a description yet.</p>
        </div>
      )}
    </ProjectSection>
  );
}
