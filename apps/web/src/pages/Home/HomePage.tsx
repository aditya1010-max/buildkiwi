import "./HomePage.css";

import ProjectCard from "../../components/project/ProjectCard";
import FeedHeader from "../../components/feed/FeedHeader";
import { useProjects } from "../../hooks/useProjects";
import { FeedCardLoader } from "../../components/FeedCardLoader";

export default function Home() {
  const { projects, loading, error } = useProjects();

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="feed">
      <FeedHeader
        title="BuildKiwi Feed"
        subtitle="Stay updated with the latest projects"
      />

      {loading ? (
        <>
          <FeedCardLoader />
          <FeedCardLoader />
          <FeedCardLoader />
        </>
      ) : (
        projects.map((project: any) => (
          <ProjectCard key={project._id} project={project} />
        ))
      )}
    </section>
  );
}
