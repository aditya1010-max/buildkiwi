import { Project } from "../../../types/project";

interface ProjectTagsProps {
  project: Project;
}

export default function ProjectTags({ project }: ProjectTagsProps) {
  if (!project.tags.length) return null;

  return (
    <section className="project-tags">
      <h2>Tags</h2>

      <div className="project-tags__list">
        {project.tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
