import { useEffect, useRef, useState } from "react";
import "./UserMenu.css";

import MainMenu from "./menus/MainMenu";
import AppearanceMenu from "./menus/AppearanceMenu";
import LanguageMenu from "./menus/LanguageMenu";
import HelpMenu from "./menus/HelpMenu";
import LogoutDialog from "./dialogs/LogoutDialog";
import NotificationsMenu from "./menus/NotificationMenu";
type UserMenuView =
  "main" | "appearance" | "language" | "notifications" | "help" | "logout";

export default function UserMenu() {
  const [activeView, setActiveView] = useState<UserMenuView>("main");
  const [isOpen, setIsOpen] = useState(false);

  function openMenu() {
    setActiveView("main");
    setIsOpen(true);
  }

  function closeMenu() {
    setActiveView("main");
    setIsOpen(false);
  }

  const menuRef = useRef<HTMLDivElement>(null);

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
                onHelp={() => setActiveView("help")}
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
              <HelpMenu onBack={() => setActiveView("main")} />
            )}
            {activeView === "logout" && (
              <LogoutDialog
                onCancel={() => setActiveView("main")}
                onConfirm={() => {
                  // TODO: Logout API
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
