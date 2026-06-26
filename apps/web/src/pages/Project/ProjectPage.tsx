import { useParams } from "react-router-dom";
import { useProject } from "../../hooks/useProjects";

import { ProjectHero } from "../../components/project/details/index";
import {
  ProjectContent,
  ProjectMetadata,
  ProjectDetailsLayout,
} from "../../components/project/details/index";

export default function ProjectPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Invalid project.</div>;
  }

  const { project, loading, error } = useProject(id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
    <div className="project-page">
      <ProjectHero project={project} />

      <ProjectDetailsLayout
        content={<ProjectContent project={project} />}
        sidebar={<ProjectMetadata project={project} />}
      />
    </div>
  );
}
