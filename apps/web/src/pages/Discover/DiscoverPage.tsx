import "./DiscoverPage.css";

import DiscoverLayout from "../../components/discover/DiscoverLayout";
import SearchBar from "../../components/discover/SearchBar";
import SearchResults from "../../components/discover/SearchResults";
import SearchSummary from "../../components/discover/SearchSummary";

import { useDiscover } from "../../hooks/useDiscover";

export default function DiscoverPage() {
  const { projects, loading, query, setQuery, filter, setFilter } =
    useDiscover();

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
          filteredCount={projects.length}
          count={projects.length}
        />

        <SearchResults projects={projects} loading={loading} />
      </DiscoverLayout>
    </main>
  );
}
