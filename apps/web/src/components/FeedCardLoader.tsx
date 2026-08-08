// no need for now

// FeedCardLoader.tsx

import "./FeedCardLoader.css";

export function FeedCardLoader() {
  return (
    <div className="feed-loader">
      <div className="feed-loader_content">
        <div className="feed-loader_header">
          <div className="skeleton avatar" />
          <div className="feed-loader_meta">
            <div className="skeleton line short" />
            <div className="skeleton line tiny" />
          </div>
        </div>

        <div className="skeleton line full" />
        <div className="skeleton line full" />
        <div className="skeleton line medium" />

        <div className="feed-loader_footer">
          <div className="skeleton button" />
          <div className="skeleton button" />
          <div className="skeleton button" />
        </div>
      </div>
    </div>
  );
}
