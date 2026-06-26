import { Project } from "../../../types/project";

interface ProjectDescriptionProps {
  project: Project;
}

export default function ProjectDescription({
  project,
}: ProjectDescriptionProps) {
  return (
    <section className="project-description">
      <h2>Description</h2>

      <p>{project.description}</p>
    </section>
  );
}
