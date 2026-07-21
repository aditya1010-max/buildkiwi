import { ReactElement } from "react";

import "./ProjectStats.css";

interface ProjectStatsProps {
  totalProjects: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps): ReactElement {
  return (
    <article className="project-stats__card">
      <span className="project-stats__label">{label}</span>

      <h2 className="project-stats__value">{value.toLocaleString()}</h2>
    </article>
  );
}

export default function ProjectStats({
  totalProjects,
  totalViews,
  totalLikes,
  totalComments,
}: ProjectStatsProps): ReactElement {
  return (
    <section className="project-stats">
      <StatCard label="Projects" value={totalProjects} />

      <StatCard label="Views" value={totalViews} />

      <StatCard label="Likes" value={totalLikes} />

      <StatCard label="Comments" value={totalComments} />
    </section>
  );
}
