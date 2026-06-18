import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import SettingsPopup from "../settings/SettingPopup";
import { HomeIcon } from "../../assets/icons";

export default function Sidebar() {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar__item">
        <div className="sidebar__logo">🥝</div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" className="sidebar__item">
          <span className="sidebar__icon">
            <HomeIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Home</span>
        </NavLink>

        <NavLink to="/discover" className="sidebar__item">
          <span className="sidebar__icon">🔍</span>
          <span className="sidebar__label">Discover</span>
        </NavLink>

        <Link
          to="/create"
          state={{ background: location }}
          className="sidebar__item" // Added here too!
        >
          <span className="sidebar__icon">➕</span>
          <span className="sidebar__label">Create</span>
        </Link>

        <NavLink to="/projects" className="sidebar__item">
          <span className="sidebar__icon">📂</span>
          <span className="sidebar__label">Projects</span>
        </NavLink>

        <NavLink to="/saved" className="sidebar__item">
          <span className="sidebar__icon">❤️</span>
          <span className="sidebar__label">Saved</span>
        </NavLink>

        <NavLink to="/profile/adi" className="sidebar__item">
          <span className="sidebar__icon">👤</span>
          <span className="sidebar__label">Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar__item">
        <button
          className="sidebar__more"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          ☰
        </button>
        {showSettings && (
          <SettingsPopup onClose={() => setShowSettings(false)} />
        )}
      </div>
    </aside>
  );
}
