import "./HomePage.css";
import ProjectCard from "../../components/project/card/ProjectCard";
import FeedHeader from "../../components/feed/FeedHeader";
import { useProjects } from "../../hooks/useProjects";
import { FeedCardLoader } from "../../components/FeedCardLoader";
import { useLanguage } from "../../hooks/useLanguage";

export default function Home() {
  const { projects, loading, error } = useProjects();
  const { t } = useLanguage();
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
        title={t("buildKiwiFeed")}
        subtitle={t("Stayupdatedwiththelatestprojects")}
      />

      {loading ? (
        <>
          <FeedCardLoader />
          <FeedCardLoader />
          <FeedCardLoader />
        </>
      ) : (
        projects.map(
          (
            project,
            index, //this ensures we have unique iD, ideally we should create a new field in schema
          ) => <ProjectCard key={index} project={project} />,
        )
      )}
    </section>
  );
}
