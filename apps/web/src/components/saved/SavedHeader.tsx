import type { ReactElement } from "react";

import "./SavedHeader.css";

interface SavedHeaderProps {
  count: number;
}

export default function SavedHeader({ count }: SavedHeaderProps): ReactElement {
  return (
    <header className="saved-header">
      <h1 className="saved-header_title">Saved Projects</h1>

      <p className="saved-header_subtitle">
        Keep your favourite projects in one place.
      </p>

      <span className="saved-header_count">
        {count} {count === 1 ? "project" : "projects"} saved
      </span>
    </header>
  );
}
