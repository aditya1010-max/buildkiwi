import "./SearchBar.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
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
    </section>
  );
}
