import { Project } from "../../../types/project";
import ProjectDescription from "./ProjectDescription";
import ProjectTags from "../card/ProjectTags";
import ProjectLinks from "./ProjectLinks";

interface ProjectContentProps {
  project: Project;
}

export default function ProjectContent({ project }: ProjectContentProps) {
  return (
    <main className="project-content">
      <ProjectDescription project={project} />
      <ProjectTags project={project} />
      <ProjectLinks project={project} />
    </main>
  );
}
