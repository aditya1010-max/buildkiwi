import "./DiscoverPage.css";

import { useMemo, useState } from "react";

import DiscoverLayout from "../../components/discover/DiscoverLayout";
import SearchBar from "../../components/discover/SearchBar";
import SearchFilters, {
  type SearchFilter,
} from "../../components/discover/SearchFilters";
import SearchResults from "../../components/discover/SearchResults";
import SearchSummary from "../../components/discover/SearchSummary";

import { useProjects } from "../../hooks/useProjects";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("all");

  const { projects, loading } = useProjects();

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return projects;
    }

    return projects.filter((project) => {
      const title = project.title.toLowerCase();
      const description = project.description.toLowerCase();
      const creator = project.creatorId.username.toLowerCase();
      const tags = project.tags.join(" ").toLowerCase();

      switch (filter) {
        case "projects":
          return title.includes(search) || description.includes(search);

        case "users":
          return creator.includes(search);

        case "tags":
          return tags.includes(search);

        default:
          return (
            title.includes(search) ||
            description.includes(search) ||
            creator.includes(search) ||
            tags.includes(search)
          );
      }
    });
  }, [projects, query, filter]);

  return (
    <main className="discover-page">
      <DiscoverLayout>
        <SearchBar
          value={query}
          onChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
        <SearchSummary
          count={projects.length}
          filteredCount={filteredProjects.length}
        />

        <SearchResults projects={filteredProjects} loading={loading} />
      </DiscoverLayout>
    </main>
  );
}
