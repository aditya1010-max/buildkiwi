import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./MobileNavbar.css";

import KiwiIcon4 from "../../assets/icons/kiwiIcon4";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function closeMenu() {
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
    <header className="mobile-nav" ref={menuRef}>
      <Link to="/" className="mobile-nav_button" aria-label="Go to homepage">
        <KiwiIcon4 size={32} />
      </Link>

      <span className="mobile-nav_brand">BuildKiwi</span>

      <button
        type="button"
        className="mobile-nav_button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="mobile-nav_menu-icon" aria-hidden="true">
          ☰
        </span>
      </button>

      {isOpen && (
        <div className="mobile-nav_menu">
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/profile");
            }}
          >
            Profile
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/settings");
            }}
          >
            Settings
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/notifications");
            }}
          >
            Notifications
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/help");
            }}
          >
            Help
          </button>
        </div>
      )}
    </header>
  );
}
