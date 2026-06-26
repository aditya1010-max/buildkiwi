import { Project } from "../../../types/project";

interface ProjectStatsProps {
  project: Project;
}

export default function ProjectStats({ project }: ProjectStatsProps) {
  const { likes, comments, views } = project.stats;

  return (
    <div className="project-stats">
      <div className="project-stat">
        <span>❤️</span>
        <span>{likes}</span>
      </div>

      <div className="project-stat">
        <span>💬</span>
        <span>{comments}</span>
      </div>

      <div className="project-stat">
        <span>👁</span>
        <span>{views}</span>
      </div>
    </div>
  );
}
