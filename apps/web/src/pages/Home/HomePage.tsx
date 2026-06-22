import "./HomePage.css";

import ProjectCard from "../../components/project/ProjectCard";
import FeedHeader from "../../components/feed/FeedHeader";
import { useProjects } from "../../hooks/useProjects";
import { FeedCardLoader } from "../../components/FeedCardLoader";

export default function Home() {
  const { projects, loading, error } = useProjects();

  if (error) {
    return (
      <section className="feed">
        <p>Failed to load projects.</p>
      </section>
    );
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
        projects.map((project, index) => (   //this ensures we have unique iD, ideally we should create a new field in schema
          <ProjectCard key={index} project={project} />
        ))
      )}
    </section>
  );
}
