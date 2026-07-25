import { useState } from "react";

import "./UserMenu.css";

import MainMenu from "./menus/MainMenu";
import AppearanceMenu from "./menus/AppearanceMenu";
import LanguageMenu from "./menus/LanguageMenu";
import HelpMenu from "./menus/HelpMenu";
import LogoutDialog from "./dialogs/LogoutDialog";

type UserMenuView = "main" | "appearance" | "language" | "help" | "logout";



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

  return (
    <div className="user-menu">
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
                onHelp={() => setActiveView("help")}
                onLogout={() => setActiveView("logout")}
              />
            )}

            {activeView === "appearance" && (
              <AppearanceMenu onBack={() => setActiveView("main")} />
            )}

            {activeView === "language" && (
              <LanguageMenu onBack={() => setActiveView("main")} />
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
