import EmptyState from "../../ui/ErrorState";
import "./EmptySearch.css";

export default function EmptySearch() {
  return (
    <EmptyState
      className="empty-search"
      title="No results found"
      message="Try searching with another keyword or explore one of the suggestions from trending section."
    />
  );
}
