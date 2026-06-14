import "./Sidebar.css";

const items = [
  "🏠 Home",
  "🔍 Discover",
  "➕ Create",
  "📂 Projects",
  "❤️ Saved",
  "👤 Profile",
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">🥝</div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <button key={item} className="sidebar__item">
            {item}
          </button>
        ))}
      </nav>

      <button className="sidebar__more">☰</button>
    </aside>
  );
}
