interface SearchSummaryProps {
  count: number;
  filteredCount: number;
}

export default function SearchSummary({
  count,
  filteredCount,
}: SearchSummaryProps) {
  return (
    <p className="search-summary">
      {filteredCount} of {count} {count === 1 ? "result" : "results"} found
    </p>
  );
}
