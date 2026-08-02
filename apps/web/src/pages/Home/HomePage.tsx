import "./HomePage.css";

import FeedHeader from "../../components/feed/FeedHeader";
import { FeedCardLoader } from "../../components/FeedCardLoader";
import ProjectCard from "../../components/project/card/ProjectCard";
import { useProjects } from "../../hooks/useProjects";
import { useLanguage } from "../../hooks/useLanguage";

export default function Home() {
  const { projects, initialLoading, loadingMore, error, pagination, loadMore } =
    useProjects();

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

      {initialLoading ? (
        <>
          <FeedCardLoader />
          <FeedCardLoader />
          <FeedCardLoader />
        </>
      ) : (
        <>
          {projects.map((project, index) => (
            <ProjectCard
              key={index} // TODO: replace with project._id once it's guaranteed unique
              project={project}
            />
          ))}

          {pagination.hasMore && (
            <>
              <button
                type="button"
                className="feed_load-more"
                onClick={loadMore}
                disabled={loadingMore}
              >
                Load More
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}
