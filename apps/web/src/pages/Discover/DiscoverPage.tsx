import { useSearchParams } from "react-router-dom";

import DiscoverLayout from "../../components/discover/DiscoverLayout";
import SearchBar from "../../components/discover/search/SearchBar";
import SearchResults from "../../components/discover/search/SearchResults";
import SearchSummary from "../../components/discover/search/SearchSummary";
import { useDiscover } from "../../hooks/useDiscover";

import "./DiscoverPage.css";

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") ?? "";

  const { projects, loading, filter, setFilter } = useDiscover(searchQuery);

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("q", trimmedValue);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <main className="discover-page">
      <DiscoverLayout>
        <SearchBar
          key={searchQuery}
          initialValue={searchQuery}
          onSearch={handleSearch}
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
