import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import SettingsPopup from "../settings/SettingPopup";

export default function Sidebar() {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">🥝</div>

      <nav className="sidebar__nav">
        <NavLink to="/" className="sidebar__item">
          🏠 Home
        </NavLink>

        <NavLink to="/discover" className="sidebar__item">
          🔍 Discover
        </NavLink>

        <Link
          to="/create"
          state={{ background: location }}
          className="sidebar__item" // Added here too!
        >
          ➕ Create
        </Link>

        <NavLink to="/projects" className="sidebar__item">
          📂 Projects
        </NavLink>

        <NavLink to="/saved" className="sidebar__item">
          ❤️ Saved
        </NavLink>

        <NavLink to="/profile/adi" className="sidebar__item">
          👤 Profile
        </NavLink>
      </nav>

      <button
        className="sidebar__more"
        onClick={() => setShowSettings((prev) => !prev)}
      >
        ☰
      </button>

      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}
    </aside>
  );
}
