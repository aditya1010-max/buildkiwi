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
      <div className="sidebar_logo">
        <div className="sidebar_item">
          <KiwiIcon4 size={40} className="sidebar_logo-image" />
          <span className="sidebar_label">BuildKiwi</span>
        </div>
      </div>

      <nav className="sidebar_nav" aria-label="Main Navigation">
        <NavLink to="/" className="sidebar_item">
          <span className="sidebar_icon">
            <HomeIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar_label">{t("home")}</span>
        </NavLink>

        <NavLink to="/discover" className="sidebar_item">
          <span className="sidebar_icon">
            <SearchIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar_label">{t("discover")}</span>
        </NavLink>

        <Link
          to={user ? "/create" : "#"}
          state={user ? { background: location } : undefined}
          className={
            user ? "sidebar_item" : "sidebar_item sidebar_item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "create or publish projects")}
          title={!user ? "Sign in to publish projects" : undefined}
        >
          <span className="sidebar_icon">
            <CreateIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar_label">{t("create")}</span>
        </Link>

        <NavLink
          to={user ? "/projects" : "#"}
          className={
            user ? "sidebar_item" : "sidebar_item sidebar_item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "manage your projects")}
          title={!user ? "Sign in to manage your projects" : undefined}
        >
          <span className="sidebar_icon">
            <ProjectIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar_label">{t("projects")}</span>
        </NavLink>

        <NavLink
          to={user ? "/saved" : "#"}
          className={
            user ? "sidebar_item" : "sidebar_item sidebar_item--disabled"
          }
          aria-disabled={!user}
          onClick={(e) => handleDisabledClick(e, "save projects")}
          title={!user ? "Sign in to save projects" : undefined}
        >
          <span className="sidebar_icon">
            <SavedIcon size={20} className="sidebar-icon" />
          </span>
          <span className="sidebar_label">{t("saved")}</span>
        </NavLink>

        {user && (
          <NavLink to={`/profile/${user.username}`} className="sidebar_item">
            <span className="sidebar_icon">
              <ProfileIcon size={20} className="sidebar-icon" />
            </span>
            <span className="sidebar_label">{t("profile")}</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar_footer">
        {user ? <UserMenu /> : <GuestSidebarCard />}
      </div>
    </aside>
  );
}
