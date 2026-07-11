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
      <div className="projects-header__content">
        <div>
          <h1 className="projects-header__title">📁 My Projects</h1>

          <p className="projects-header__subtitle">
            Manage all your BuildKiwi projects in one place.
          </p>
        </div>

        <button className="projects-header__button" onClick={onCreateProject}>
          + New Project
        </button>
      </div>

      <div className="projects-header__stats">
        <span>{totalProjects} Projects</span>
      </div>
    </header>
  );
};

export default ProjectsHeader;
