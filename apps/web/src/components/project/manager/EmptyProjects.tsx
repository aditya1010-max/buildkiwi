import type { ReactElement } from "react";

import "./EmptyProjects.css";

interface EmptyProjectsProps {
  onCreateProject?: () => void;
}

export default function EmptyProjects({
  onCreateProject,
}: EmptyProjectsProps): ReactElement {
  return (
    <section className="empty-projects">
      <div className="empty-projects_content">
        <div className="empty-projects_icon" aria-hidden="true">
          📂
        </div>

        <h2 className="empty-projects_title">No projects yet</h2>

        <p className="empty-projects_description">
          You haven't created any projects yet. Start building your first
          project and showcase it to the community.
        </p>

        {onCreateProject && (
          <button
            type="button"
            className="empty-projects_button"
            onClick={onCreateProject}
          >
            Create Project
          </button>
        )}
      </div>
    </section>
  );
}
