import "./SearchFilters.css";

export type SearchFilter = "all" | "projects" | "tags";

interface SearchFiltersProps {
  activeFilter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

const filters: {
  label: string;
  value: SearchFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Projects", value: "projects" },
  { label: "Tags", value: "tags" },
];

export default function SearchFilters({
  activeFilter,
  onFilterChange,
}: SearchFiltersProps) {
  return (
    <section className="search-filters">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={
            activeFilter === filter.value
              ? "search-filters__chip search-filters__chip--active"
              : "search-filters__chip"
          }
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </section>
  );
}
