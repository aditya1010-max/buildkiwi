import { useState, type FormEvent, type ReactNode } from "react";

import Button from "../../ui/Button";
import SearchFilters, { type SearchFilter } from "./SearchFilters";

import "./SearchBar.css";

interface SearchBarProps {
  initialValue: string;
  onSearch: (value: string) => void;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  children?: ReactNode;
}

const placeholders: Record<SearchFilter, string> = {
  all: "Search everything...",
  projects: "Search projects...",
  tags: "Search tags...",
};

export default function SearchBar({
  initialValue,
  onSearch,
  filter,
  onFilterChange,
  children,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const placeholder = placeholders[filter];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <>
      <section className="search-bar">
        <form className="search-bar_input-wrapper" onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            aria-label={placeholder}
            className="search-bar_input"
            onChange={(event) => setValue(event.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            className="search-bar_button"
            disabled={!value.trim()}
          >
            Search
          </Button>
        </form>

        <SearchFilters activeFilter={filter} onFilterChange={onFilterChange} />
      </section>

      {children && <div className="search-bar_results">{children}</div>}
    </>
  );
}
