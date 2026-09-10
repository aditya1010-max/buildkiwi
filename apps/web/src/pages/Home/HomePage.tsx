import "./HomePage.css";

import FeedHeader from "../../components/feed/FeedHeader";
import FeedCardSkeleton from "../../components/feed/FeedCardLoader";
import ProjectCard from "../../components/projects/card/ProjectCard";
import { useProjects } from "../../hooks/useProjects";
import { useLanguage } from "../../hooks/useLanguage";
import ErrorState from "../../components/ui/ErrorState";

export default function Home() {
  const { projects, initialLoading, loadingMore, error, pagination, loadMore } =
    useProjects();

  const { t } = useLanguage();

  if (error) {
    return (
      <ErrorState
        title="Failed to load projects"
        message="Something went wrong while loading the projects."
      />
    );
  }

  return (
    <section className="feed">
      <FeedHeader
        title={t("buildKiwiFeed")}
        subtitle={t("Stayupdatedwiththelatestprojects")}
      />

      <div className="feed-content">
        {initialLoading ? (
          <>
            <FeedCardSkeleton />
            <FeedCardSkeleton />
          </>
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard
                key={project._id} // TODO: replace with project._id once it's guaranteed unique
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
      </div>
    </section>
  );
}
