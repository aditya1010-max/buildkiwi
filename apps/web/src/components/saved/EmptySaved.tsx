import "./EmptySaved.css";

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export default function EmptySaved(): ReactElement {
  return (
    <section className="empty-saved">
      <div className="empty-saved__icon">🔖</div>

      <h2>No saved projects yet</h2>

      <p>Projects you save will appear here.</p>

      <Link className="empty-saved__button" to="/discover">
        Explore Projects
      </Link>
    </section>
  );
}
