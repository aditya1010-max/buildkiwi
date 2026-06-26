import { Project } from "../../../types/project";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <div className="project-header__info">
        <h3 className="project-header__title">{project.title}</h3>

        <p className="project-header__creator">@{project.creatorId.username}</p>

        <span className="project-header__date">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </header>
  );
}
