import type { Project } from "../../../types/project";
import "./ProjectSidebar.css";
interface ProjectSidebarProps {
  project: Project;
}

export default function ProjectSidebar({ project }: ProjectSidebarProps) {
  //change className to project-metadata later
  return (
    <aside className="project-metadata">
      <h2>Project Info</h2>

      <div className="project-metadata_item">
        <span>Views</span>
        <strong>{project.stats.views}</strong>
      </div>

      <div className="project-metadata_item">
        <span>Likes</span>
        <strong>{project.stats.likes}</strong>
      </div>

      <div className="project-metadata_item">
        <span>Comments</span>
        <strong>{project.stats.comments}</strong>
      </div>

      <div className="project-metadata_item">
        <span>Created</span>
        <strong>{new Date(project.createdAt).toLocaleDateString()}</strong>
      </div>

      <div className="project-metadata_item">
        <span>Updated</span>
        <strong>{new Date(project.updatedAt).toLocaleDateString()}</strong>
      </div>
    </aside>
  );
}
