import "./ProfileGrid.css";

import { ProjectCard } from "../project/card";
import { Project } from "../../types/project";

interface ProfileGridProps {
  projects: Project[];
}

export default function ProfileGrid({ projects }: ProfileGridProps) {
  return (
    <section className="profile-grid">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </section>
  );
}
