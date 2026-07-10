import "./DiscoverPage.css";

import { useMemo, useState } from "react";

import DiscoverLayout from "../../components/discover/DiscoverLayout";
import SearchBar from "../../components/discover/SearchBar";
import SearchFilters, {
  type SearchFilter,
} from "../../components/discover/SearchFilters";
import SearchResults from "../../components/discover/SearchResults";

import { useProjects } from "../../hooks/useProjects";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("all");

  const { projects, loading } = useProjects();

  const filteredProjects = useMemo(() => {
    const search = query.toLowerCase().trim();

    return projects.filter((project) => {
      if (!search) return true;

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

        case "all":
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
        <SearchBar value={query} onChange={setQuery} />

        <SearchFilters activeFilter={filter} onFilterChange={setFilter} />

        <SearchResults projects={filteredProjects} loading={loading} />
      </DiscoverLayout>
    </main>
  );
}
