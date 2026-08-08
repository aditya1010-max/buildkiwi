import "./ProjectTags.css";
import { Project } from "../../../types/project";
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
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div>
          <p>No Technologies Added</p>
          <p>The project owner hasn't added any technologies yet.</p>
        </div>
      )}
    </ProjectSection>
  );
}
