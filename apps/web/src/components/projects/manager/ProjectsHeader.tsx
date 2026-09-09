import "./ProjectsHeader.css";

interface ProjectsHeaderProps {
  totalProjects: number;
  onCreateProject?: () => void;
}

const ProjectsHeader = ({
  totalProjects,
  onCreateProject,
}: ProjectsHeaderProps) => {
  return (
    <header className="projects-header">
      <div className="projects-header_content">
        <div>
          <h1 className="projects-header_title">📁 My Projects</h1>

          <p className="projects-header_subtitle">
            Manage all your BuildKiwi projects in one place.
          </p>
        </div>

        <button className="projects-header_button" onClick={onCreateProject}>
          + New Project
        </button>
      </div>

      <div className="projects-header_stats">
        <span>{totalProjects} Projects</span>
      </div>
    </header>
  );
};

export default ProjectsHeader;
