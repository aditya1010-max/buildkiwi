import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MobileNavbar.css";

import KiwiIcon4 from "../../assets/icons/kiwiIcon4";
import AppearanceMenu from "../user-menu/menus/AppearanceMenu";
import HelpMenu from "../user-menu/menus/HelpMenu";
import LanguageMenu from "../user-menu/menus/LanguageMenu";
import MainMenu from "../user-menu/menus/MainMenu";
import NotificationsMenu from "../user-menu/menus/NotificationMenu";
import LogoutDialog from "../user-menu/dialogs/LogoutDialog";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

type MobileMenuView =
  "main" | "appearance" | "language" | "notifications" | "help" | "logout";

export default function MobileNav() {
  const [activeView, setActiveView] = useState<MobileMenuView>("main");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const { logout, getCurrentUser } = useAuth();
  const toast = useToast();
  const user = getCurrentUser();

  function openMenu() {
    setActiveView("main");
    setIsOpen(true);
  }

  function closeMenu() {
    setActiveView("main");
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header ref={menuRef} className="mobile-nav">
      <div className="mobile-nav_header">
        <button
          type="button"
          className="mobile-nav_button"
          aria-label="Go to homepage"
          onClick={() => navigate("/")}
        >
          <KiwiIcon4 size={32} />
        </button>

        <span className="mobile-nav_brand">BuildKiwi</span>

        <button
          type="button"
          className="mobile-nav_button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => {
            if (isOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
        >
          <span className="mobile-nav_menu-icon" aria-hidden="true">
            ☰
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="mobile-nav_menu">
          {activeView === "main" && (
            <MainMenu
              user={user}
              onAppearance={() => setActiveView("appearance")}
              onLanguage={() => setActiveView("language")}
              onNotifications={() => setActiveView("notifications")}
              onPrivacy={() => {
                closeMenu();
                navigate("/settings/privacy");
              }}
              onHelp={() => setActiveView("help")}
              onFeedback={() => {
                closeMenu();
                navigate("/feedback");
              }}
              onLogout={() => setActiveView("logout")}
              onAccount={() => {}}
              onLogin={() => {
                closeMenu();
                navigate("/login");
              }}
              onRegister={() => {
                closeMenu();
                navigate("/register");
              }}
            />
          )}

          {activeView === "appearance" && (
            <AppearanceMenu onBack={() => setActiveView("main")} />
          )}

          {activeView === "language" && (
            <LanguageMenu onBack={() => setActiveView("main")} />
          )}

          {activeView === "notifications" && (
            <NotificationsMenu onBack={() => setActiveView("main")} />
          )}

          {activeView === "help" && (
            <HelpMenu
              onBack={() => setActiveView("main")}
              onDocumentation={() => {
                closeMenu();
                navigate("/docs");
              }}
            />
          )}

          {activeView === "logout" && (
            <LogoutDialog
              onCancel={() => setActiveView("main")}
              onConfirm={async () => {
                await logout();

                toast.success(
                  "Signed out",
                  "You're now browsing BuildKiwi as a guest.",
                );

                closeMenu();

                navigate("/", {
                  replace: true,
                });
              }}
            />
          )}
        </div>
      )}
    </header>
  );
}
