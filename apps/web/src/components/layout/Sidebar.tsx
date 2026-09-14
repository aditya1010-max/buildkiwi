import { Link, NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

import KiwiIcon4 from "../../assets/icons/kiwiIcon4";
import UserMenu from "../user-menu/UserMenu";
import GuestSidebarCard from "./GuestSidebarCard";
import { navigationItems } from "../../navigation/navigationItems";

import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

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
        <Link to="/" className="sidebar_item">
          <KiwiIcon4 size={40} className="sidebar_logo-image" />

          <span className="sidebar_label">BuildKiwi</span>
        </Link>
      </div>

      <nav className="sidebar_nav" aria-label="Main Navigation">
        {navigationItems.map((item) => {
          if (item.id === "profile" && !user) {
            return null;
          }

          if (item.requiresAuth && !user) {
            return (
              <Link
                key={item.id}
                to="#"
                className="sidebar_item sidebar_item--disabled"
                aria-disabled="true"
                onClick={(e) =>
                  handleDisabledClick(e, item.disabledAction ?? item.labelKey)
                }
                title={item.disabledTitle}
              >
                <span className="sidebar_icon">
                  <item.icon size={20} className="sidebar-icon" />
                </span>

                <span className="sidebar_label">{t(item.labelKey)}</span>
              </Link>
            );
          }

          const to =
            item.id === "profile" ? `/profile/${user!.username}` : item.to!;

          if (item.id === "create") {
            return (
              <Link
                key={item.id}
                to={to}
                state={{ background: location }}
                className="sidebar_item"
              >
                <span className="sidebar_icon">
                  <item.icon size={20} className="sidebar-icon" />
                </span>

                <span className="sidebar_label">{t(item.labelKey)}</span>
              </Link>
            );
          }

          return (
            <NavLink key={item.id} to={to} className="sidebar_item">
              <span className="sidebar_icon">
                <item.icon size={20} className="sidebar-icon" />
              </span>

              <span className="sidebar_label">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar_footer">
        {user ? <UserMenu /> : <GuestSidebarCard />}
      </div>
    </aside>
  );
}
