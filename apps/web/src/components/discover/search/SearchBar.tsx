import type { FormEvent, ReactNode } from "react";
import "./SearchBar.css";

import Input from "../../ui/Input";
import type { SearchFilter } from "./SearchFilters";
import Button from "../../ui/Button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
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
  value,
  onChange,
  onSearch,
  filter,
  onFilterChange,
  children,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
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
              onChange={(event) => onChange(event.target.value)}
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

        <div className="search-bar_filters">
          {(["all", "projects", "tags"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={
                filter === item
                  ? "search-bar_chip search-bar_chip--active"
                  : "search-bar_chip"
              }
              onClick={() => onFilterChange(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {children && <div className="search-bar_results">{children}</div>}
    </>
  );
}
