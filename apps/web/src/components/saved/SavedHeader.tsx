import "./SavedHeader.css";

import type { ReactElement } from "react";

interface SavedHeaderProps {
  count: number;
}

export default function SavedHeader({ count }: SavedHeaderProps): ReactElement {
  return (
    <header className="saved-header">
      <h1>Saved Projects</h1>
      <p>Keep your favourite projects in one place.</p>
      <span>
        {count} {count === 1 ? "project" : "projects"} saved
      </span>
    </header>
  );
}
