import "./SearchResults.css";

import type { Project } from "../../../types/project";

import ProjectCard from "../../projects/card/ProjectCard";
import EmptySearch from "../states/EmptySearch";

interface SearchResultsProps {
  projects: Project[];
  loading?: boolean;
}

export default function SearchResults({
  projects,
  loading = false,
}: SearchResultsProps) {
  if (loading) {
    return (
      <section className="search-results">
        <p className="search-results_message">Searching...</p>
      </section>
    );
  }

  if (projects.length === 0) {
    return <EmptySearch />;
  }

  return (
    <section className="search-results">
      <div className="search-results_grid">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
