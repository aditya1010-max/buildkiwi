import "./EmptyProjects.css";

interface EmptyProjectsProps {
  onCreateProject?: () => void;
}

const EmptyProjects = ({ onCreateProject }: EmptyProjectsProps) => {
  return (
    <section className="empty-projects">
      <div className="empty-projects__content">
        <div className="empty-projects__icon">📂</div>

        <h2 className="empty-projects__title">No projects found</h2>

        <p className="empty-projects__description">
          You haven't created any projects yet. Start building your first
          project and showcase it to the community.
        </p>

        <button className="empty-projects__button" onClick={onCreateProject}>
          Create Project
        </button>
      </div>
    </section>
  );
};

export default EmptyProjects;
