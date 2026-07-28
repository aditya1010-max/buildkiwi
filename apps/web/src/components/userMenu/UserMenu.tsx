import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./UserMenu.css";

import AppearanceMenu from "./menus/AppearanceMenu";
import HelpMenu from "./menus/HelpMenu";
import LanguageMenu from "./menus/LanguageMenu";
import MainMenu from "./menus/MainMenu";
import NotificationsMenu from "./menus/NotificationMenu";
import LogoutDialog from "./dialogs/LogoutDialog";

type UserMenuView =
  "main" | "appearance" | "language" | "notifications" | "help" | "logout";

export default function UserMenu() {
  const [activeView, setActiveView] = useState<UserMenuView>("main");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function openMenu() {
    setActiveView("main");
    setIsOpen(true);
  }

  function closeMenu() {
    setActiveView("main");
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

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
    <div ref={menuRef} className="user-menu">
      <button
        type="button"
        className="user-menu__button"
        onClick={() => {
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
      >
        ☰
      </button>

      {isOpen && (
        <div className="user-menu__popup">
          <div className="user-menu__content">
            {activeView === "main" && (
              <MainMenu
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
                onConfirm={() => {
                  // TODO: Call logout API
                  closeMenu();
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
