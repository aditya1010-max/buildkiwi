import "./HomePage.css";

import ProjectCard from "../../components/project/ProjectCard";
import FeedHeader from "../../components/feed/FeedHeader";
import { useProjects } from "../../hooks/useProjects";

export default function Home() {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="feed">
      <FeedHeader
        title="BuildKiwi Feed"
        subtitle="Stay updated with the latest projects"
      />

      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
        />
      ))}
    </section>
  );
}