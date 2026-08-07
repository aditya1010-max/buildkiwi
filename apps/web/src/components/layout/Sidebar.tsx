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
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import GuestSidebarCard from "./GuestSidebarCard";

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { getCurrentUser } = useAuth();
  const toast = useToast();
  const user = getCurrentUser();

  const handleDisabledClick = (e: React.MouseEvent, actionName: string) => {
    if (!user) {
      e.preventDefault();
      toast.warning("Sign in required", `Sign in to ${actionName}.`);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__item">
          <KiwiIcon4 size={40} className="sidebar__logo-image" />
          <span className="sidebar__label">BuildKiwi</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main Navigation">
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
          to={user ? "/create" : "#"}
          state={user ? { background: location } : undefined}
          className={
            user ? "sidebar__item" : "sidebar__item sidebar__item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "create or publish projects")}
          title={!user ? "Sign in to publish projects" : undefined}
        >
          <span className="sidebar__icon">
            <CreateIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("create")}</span>
        </Link>

        <NavLink
          to={user ? "/projects" : "#"}
          className={
            user ? "sidebar__item" : "sidebar__item sidebar__item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "manage your projects")}
          title={!user ? "Sign in to manage your projects" : undefined}
        >
          <span className="sidebar__icon">
            <ProjectIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("projects")}</span>
        </NavLink>

        <NavLink
          to={user ? "/saved" : "#"}
          className={
            user ? "sidebar__item" : "sidebar__item sidebar__item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "save projects")}
          title={!user ? "Sign in to save projects" : undefined}
        >
          <span className="sidebar__icon">
            <SavedIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar__label">{t("saved")}</span>
        </NavLink>

        {user && (
          <NavLink to={`/profile/${user.username}`} className="sidebar__item">
            <span className="sidebar__icon">
              <ProfileIcon size={20} className="sidebar-icon" />
            </span>
            <span className="sidebar__label">{t("profile")}</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar__footer">
        {user ? <UserMenu /> : <GuestSidebarCard />}
      </div>
    </aside>
  );
}
