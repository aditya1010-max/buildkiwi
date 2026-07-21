import { ReactElement } from "react";

import "./ProjectsGrid.css";

import type { Project } from "../../../types/project";

import ProjectManagerCard from "./ProjectManagerCard";
import EmptyProjects from "./EmptyProjects";

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({
  projects,
}: ProjectGridProps): ReactElement {
  if (projects.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <section className="project-grid">
      {projects.map((project) => (
        <ProjectManagerCard key={project._id} project={project} />
      ))}
    </section>
  );
}
