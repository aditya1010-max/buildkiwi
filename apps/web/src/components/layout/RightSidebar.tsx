import { createSearchParams, useNavigate } from "react-router-dom";
import "./RightSidebar.css";

import KiwiAchievements from "../discover/achievements/KiwiAchievements";

export default function RightSidebar() {
  const navigate = useNavigate();

  const trendingTags = ["react", "typescript", "opensource", "ai"];

  function handleTrendingClick(tag: string) {
    navigate({
      pathname: "/discover",
      search: createSearchParams({
        q: tag,
      }).toString(),
    });
  }

  return (
    <aside className="right-sidebar">
      <section className="widget trending-widget">
        <h3 className="trending-title">
          <span className="trending-icon" aria-hidden="true">
            ↗
          </span>
          Trending
        </h3>

        <div className="trending-tags">
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="trending-tag"
              onClick={() => handleTrendingClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <KiwiAchievements />
    </aside>
  );
}
