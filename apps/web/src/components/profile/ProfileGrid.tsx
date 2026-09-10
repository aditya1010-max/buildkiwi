import "./ProfileGrid.css";

import { ProjectCard } from "../projects/card";
import { Project } from "../../types/project";

interface ProfileGridProps {
  projects: Project[];
}

export default function ProfileGrid({ projects }: ProfileGridProps) {
  const validProjects = projects.filter(
    (project): project is NonNullable<typeof project> => project !== null,
  );

  return (
    <section className="profile-grid">
      {validProjects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </section>
  );
}
