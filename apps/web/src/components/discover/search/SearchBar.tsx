import { useState, type FormEvent, type ReactNode } from "react";
import "./SearchBar.css";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SearchFilters, { type SearchFilter } from "./SearchFilters";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <>
      <section className="search-bar">
        <form className="search-bar_content" onSubmit={handleSubmit}>
          <div className="search-bar_input-wrapper">
            <Input
              type="text"
              placeholder={placeholders[filter]}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="search-bar_input"
              aria-label={placeholders[filter]}
            />

            <Button
              type="submit"
              variant="primary"
              className="search-bar_button"
              disabled={!value.trim()}
            >
              Search
            </Button>
          </div>
        </form>

        <SearchFilters activeFilter={filter} onFilterChange={onFilterChange} />
      </section>

      {children && <div className="search-bar_results">{children}</div>}
    </>
  );
}
