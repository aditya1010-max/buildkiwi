import "./RightSidebar.css";

import KiwiAchievements from "../discover/KiwiAchievements";

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <section className="widget">
        <h3>Trending</h3>

        <ul>
          <li>#react</li>
          <li>#typescript</li>
          <li>#opensource</li>
        </ul>
      </section>

      <KiwiAchievements />
    </aside>
  );
}
