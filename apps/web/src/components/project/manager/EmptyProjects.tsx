import "./EmptyProjects.css";

interface EmptyProjectsProps {
  onCreateProject?: () => void;
}

const EmptyProjects = ({ onCreateProject }: EmptyProjectsProps) => {
  return (
    <section className="empty-projects">
      <div className="empty-projects_content">
        <div className="empty-projects_icon">📂</div>

        <h2 className="empty-projects_title">No projects found</h2>

        <p className="empty-projects_description">
          You haven't created any projects yet. Start building your first
          project and showcase it to the community.
        </p>

        <button className="empty-projects_button" onClick={onCreateProject}>
          Create Project
        </button>
      </div>
    </section>
  );
};

export default EmptyProjects;
