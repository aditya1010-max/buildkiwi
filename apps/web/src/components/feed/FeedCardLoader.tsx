import type { ReactElement } from "react";
import "./FeedCardLoader.css";

interface FeedCardLoaderProps {
  count?: number;
}

function FeedCardSkeleton(): ReactElement {
  return (
    <article className="feed-card-loader">
      {/* Creator */}
      <div className="feed-card-loader_creator">
        <div className="feed-card-loader_avatar skeleton" />

        <div className="feed-card-loader_creator-info">
          <div className="feed-card-loader_creator-name skeleton" />
          <div className="feed-card-loader_date skeleton" />
        </div>
      </div>

      {/* Title */}
      <div className="feed-card-loader_title skeleton" />

      {/* Description */}
      <div className="feed-card-loader_description">
        <div className="skeleton" />
        <div className="skeleton" />
      </div>

      {/* Tags */}
      <div className="feed-card-loader_tags">
        <div className="feed-card-loader_tag skeleton" />
        <div className="feed-card-loader_tag skeleton" />
        <div className="feed-card-loader_tag skeleton" />
        <div className="feed-card-loader_tag feed-card-loader_tag--short skeleton" />
        <div className="feed-card-loader_tag feed-card-loader_tag--small skeleton" />
        <div className="feed-card-loader_tag feed-card-loader_tag--small skeleton" />
        <div className="feed-card-loader_tag feed-card-loader_tag--small skeleton" />
      </div>

      {/* Actions */}
      <div className="feed-card-loader_actions">
        <div className="feed-card-loader_action">
          <div className="feed-card-loader_icon skeleton" />
          <div className="feed-card-loader_count skeleton" />
        </div>

        <div className="feed-card-loader_action">
          <div className="feed-card-loader_icon skeleton" />
          <div className="feed-card-loader_count skeleton" />
        </div>

        <div className="feed-card-loader_action">
          <div className="feed-card-loader_icon skeleton" />
          <div className="feed-card-loader_count skeleton" />
        </div>

        <div className="feed-card-loader_action feed-card-loader_action--bookmark">
          <div className="feed-card-loader_bookmark skeleton" />
        </div>
      </div>
    </article>
  );
}

export default function FeedCardLoader({
  count = 2,
}: FeedCardLoaderProps): ReactElement {
  return (
    <section className="feed-card-loaders" aria-label="Loading projects">
      {Array.from({ length: count }, (_, index) => (
        <FeedCardSkeleton key={index} />
      ))}
    </section>
  );
}
