import type { ReactElement } from "react";

import "./ProjectsGrid.css";

import type { Project } from "../../../types/project";
import ProjectManagerCard from "./ProjectManagerCard";
import EmptyProjects from "./EmptyProjects";

interface ProjectGridProps {
  projects: Project[];
  onCreateProject: () => void;
}

export default function ProjectGrid({
  projects,
  onCreateProject,
}: ProjectGridProps): ReactElement {
  if (projects.length === 0) {
    return <EmptyProjects onCreateProject={onCreateProject} />;
  }

  return (
    <section className="project-grid">
      {projects.map((project) => (
        <ProjectManagerCard key={project._id} project={project} />
      ))}
    </section>
  );
}
