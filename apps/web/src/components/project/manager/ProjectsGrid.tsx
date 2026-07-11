import "./ProjectsGrid.css";

import ProjectCard from "../card/ProjectCard";
import { Project } from "../../../types/project";

interface ProjectsGridProps {
  projects: Project[];
}

const ProjectsGrid = ({ projects }: ProjectsGridProps) => {
  return (
    <section className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </section>
  );
};

export default ProjectsGrid;
