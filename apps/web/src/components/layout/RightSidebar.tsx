import { useNavigate } from "react-router-dom";
import "./RightSidebar.css";

import KiwiAchievements from "../discover/KiwiAchievements";

export default function RightSidebar() {
  const navigate = useNavigate();

  const trendingTags = ["react", "typescript", "opensource"];

  function handleTrendingClick(tag: string) {
    navigate(`/discover?q=${encodeURIComponent(tag)}`);
  }

  return (
    <aside className="right-sidebar">
      <section className="widget">
        <h3>Trending</h3>

        <ul>
          {trendingTags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => handleTrendingClick(tag)}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <KiwiAchievements />
    </aside>
  );
}