import "./SearchBar.css";
import type { SearchFilter } from "./SearchFilters";
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

export default function SearchBar({
  value,
  onChange,
  filter,
  onFilterChange,
}: SearchBarProps) {
  return (
    <section className="search-bar">
      <div className="search-bar__content">
        <h1>Discover</h1>

        <p>Search projects, developers and technologies.</p>

        <div className="search-bar__input-wrapper">
          <span className="search-bar__icon">🔍</span>

          <input
            type="text"
            placeholder="Search projects, users or tags..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      <div className="search-bar__filters">
        {["projects", "users", "tags"].map((item) => (
          <button
            key={item}
            type="button"
            className={
              filter === item
                ? "search-bar__chip search-bar__chip--active"
                : "search-bar__chip"
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
