import "./ProjectOverview.css";

import type { Project } from "../../../types/project";

import ProjectDescription from "./ProjectDescription";
import ProjectTags from "./ProjectTags";
import ProjectLinks from "./ProjectLinks";

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="project-overview">
      <ProjectDescription project={project} />
      <ProjectTags project={project} />
      <ProjectLinks project={project} />
    </div>
  );
}
