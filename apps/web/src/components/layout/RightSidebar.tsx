import { createSearchParams, useNavigate } from "react-router-dom";

import "./RightSidebar.css";

import KiwiAchievements from "../discover/achievements/KiwiAchievements";
import Badge from "../ui/Badge";

const trendingTags = [
  "nodejs",
  "gemini",
  "css",
  "javascript",
  "ai",
  "react",
  "typescript",
  "opensource",
];

export default function RightSidebar() {
  const navigate = useNavigate();

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
              aria-label={`Search for ${tag}`}
            >
              <Badge variant="accent" size="lg">
                #{tag}
              </Badge>
            </button>
          ))}
        </div>
      </section>

      <KiwiAchievements />
    </aside>
  );
}