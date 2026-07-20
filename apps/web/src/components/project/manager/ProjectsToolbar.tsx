import "./ProjectsToolbar.css";

interface ProjectsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const ProjectsToolbar = ({ search, onSearchChange }: ProjectsToolbarProps) => {
  return (
    <div className="projects-toolbar">
      <div className="projects-toolbar__search">
        <input
          type="text"
          placeholder="Search your projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="projects-toolbar__actions">
        <button className="projects-toolbar__button" type="button">
          Sort
        </button>

        <button className="projects-toolbar__button" type="button">
          Filter
        </button>
      </div>
    </div>
  );
};

export default ProjectsToolbar;
