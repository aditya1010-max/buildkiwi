import { Link, NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import KiwiIcon4 from "../../assets/icons/kiwiIcon4";
import UserMenu from "../../components/userMenu/UserMenu";
import {
  HomeIcon,
  SearchIcon,
  ProjectIcon,
  SavedIcon,
  ProfileIcon,
  CreateIcon,
} from "../../assets/icons";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__item">
          <KiwiIcon4 size={40} className="sidebar__logo-image" />
          <span className="sidebar__label">BuildKiwi</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" className="sidebar__item">
          <span className="sidebar__icon">
            <HomeIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Home</span>
        </NavLink>

        <NavLink to="/discover" className="sidebar__item">
          <span className="sidebar__icon">
            <SearchIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Discover</span>
        </NavLink>

        <Link
          to="/create"
          state={{ background: location }}
          className="sidebar__item"
        >
          <span className="sidebar__icon">
            <CreateIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Create</span>
        </Link>

        <NavLink to="/projects" className="sidebar__item">
          <span className="sidebar__icon">
            <ProjectIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Projects</span>
        </NavLink>

        <NavLink to="/saved" className="sidebar__item">
          <span className="sidebar__icon">
            <SavedIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Saved</span>
        </NavLink>

        <NavLink to="/profile/adi" className="sidebar__item">
          <span className="sidebar__icon">
            <ProfileIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">Profile</span>
        </NavLink>
      </nav>
      <div className="sidebar__footer">
        <UserMenu />
      </div>
    </aside>
  );
}
