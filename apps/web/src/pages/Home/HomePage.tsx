//temporary
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
    <div className="max-w-2xl mx-auto p-4">
      <FeedHeader
        title="BuildKiwi Feed"
        subtitle="Stay updated with the latest projects"
      />

      <h1 className="text-3xl font-bold mb-6">BuildKiwi Feed</h1>
      <br></br>
      <br></br>

      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
