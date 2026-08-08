import { Project } from "../../../types/project";

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="project-header">
      <div className="project-header_info">
        <h3 className="project-header_title">{project.title}</h3>

        <p className="project-header_creator">@{project.creatorId.username}</p>

        <span className="project-header_date">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </header>
  );
}
