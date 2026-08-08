import "./EmptySaved.css";

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function EmptySaved(): ReactElement {
  return (
    <section className="empty-saved">
      <div className="empty-saved_icon">🔖</div>

      <h2>No saved projects yet</h2>

      <p>Projects you save will appear here.</p>

      <Link className="empty-saved_button" to="/discover">
        Explore Projects
      </Link>
    </section>
  );
}
