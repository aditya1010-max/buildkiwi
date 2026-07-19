import "./ProjectTags.css";
import { Project } from "../../../types/project";
import ProjectSection from "../shared/ProjectSection";
interface ProjectTagsProps {
  project: Project;
}

export default function ProjectTags({ project }: ProjectTagsProps) {
  const tags = project.tags ?? [];

  return (
    <ProjectSection title="Technologies">
      {tags.length > 0 ? (
        <div className="project-tags__list">
          {tags.map((tag) => (
            <span key={tag} className="project-tags__tag">
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <div className="project-tags__empty">
          <h3>No Technologies Added</h3>

          <p>The project owner hasn't added any technologies yet.</p>
        </div>
      )}
    </ProjectSection>
  );
}
