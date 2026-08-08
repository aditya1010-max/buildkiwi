import "./SearchBar.css";
import type { SearchFilter } from "./SearchFilters";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

const placeholders: Record<SearchFilter, string> = {
  all: "Search everything...",
  projects: "Search projects...",
  tags: "Search tags...",
};

export default function SearchBar({
  value,
  onChange,
  filter,
  onFilterChange,
}: SearchBarProps) {
  return (
    <section className="search-bar">
      <div className="search-bar_content">
        <h1>Discover</h1>

        <p>Search projects or tags.</p>

        <div className="search-bar_input-wrapper">
          <input
            type="text"
            placeholder={placeholders[filter]}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      <div className="search-bar_filters">
        {["all", "projects", "tags"].map((item) => (
          <button
            key={item}
            type="button"
            className={
              filter === item
                ? "search-bar_chip search-bar_chip--active"
                : "search-bar_chip"
            }
            onClick={() => onFilterChange(item as SearchFilter)}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
    </section>
  );
}
