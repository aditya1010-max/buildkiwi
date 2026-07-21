import { ReactElement } from "react";

import "./ProjectsToolbar.css";

interface ProjectToolbarProps {
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function ProjectToolbar({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: ProjectToolbarProps): ReactElement {
  return (
    <section className="project-toolbar">
      <input
        type="search"
        className="project-toolbar__search"
        placeholder="Search your projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="project-toolbar__sort"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="updated">Recently Updated</option>
        <option value="views">Most Viewed</option>
        <option value="likes">Most Liked</option>
      </select>
    </section>
  );
}
