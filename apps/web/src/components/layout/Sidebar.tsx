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
import { useLanguage } from "../../hooks/useLanguage";

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

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
          <span className="sidebar__label">{t("home")}</span>
        </NavLink>

        <NavLink to="/discover" className="sidebar__item">
          <span className="sidebar__icon">
            <SearchIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("discover")}</span>
        </NavLink>

        <Link
          to="/create"
          state={{ background: location }}
          className="sidebar__item"
        >
          <span className="sidebar__icon">
            <CreateIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("create")}</span>
        </Link>

        <NavLink to="/projects" className="sidebar__item">
          <span className="sidebar__icon">
            <ProjectIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("projects")}</span>
        </NavLink>

        <NavLink to="/saved" className="sidebar__item">
          <span className="sidebar__icon">
            <SavedIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("saved")}</span>
        </NavLink>

        <NavLink to="/profile/adi" className="sidebar__item">
          <span className="sidebar__icon">
            <ProfileIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("profile")}</span>
        </NavLink>
      </nav>
      <div className="sidebar__footer">
        <UserMenu />
      </div>
    </aside>
  );
}
