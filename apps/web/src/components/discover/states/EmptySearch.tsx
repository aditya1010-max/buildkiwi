import "./EmptySearch.css";

const suggestions = ["React", "TypeScript", "Node.js", "Portfolio", "AI"];

export default function EmptySearch() {
  return (
    <section className="empty-search">
      <div className="empty-search_icon">🔍</div>

      <h2>No results found</h2>

      <p>
        Try searching with another keyword or explore one of the suggestions
        below.
      </p>

      <div className="empty-search_suggestions">
        {suggestions.map((item) => (
          <button key={item} type="button" className="empty-search_chip">
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}
