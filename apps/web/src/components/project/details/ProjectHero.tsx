import { Project } from "../../../types/project";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="project-hero">
      <img src={project.coverImage} alt={project.title} />

      <h1>{project.title}</h1>

      <p>@{project.creatorId.username}</p>

      <small>{new Date(project.createdAt).toLocaleDateString()}</small>
    </section>
  );
}
