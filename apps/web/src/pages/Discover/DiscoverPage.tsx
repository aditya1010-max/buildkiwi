import { useState } from "react";
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

  const [searchInput, setSearchInput] = useState(searchQuery);

  const { projects, loading, setQuery, filter, setFilter } =
    useDiscover(searchQuery);

  const handleSearch = () => {
    const trimmedValue = searchInput.trim();

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

    setQuery(trimmedValue);
  };

  return (
    <main className="discover-page">
      <DiscoverLayout>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
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
