import "./MobileNavbar.css";

import KiwiIcon4 from "../../assets/icons/kiwiIcon4";

export default function MobileNav() {
  return (
    <header className="mobile-nav">
      <button
        type="button"
        className="mobile-nav_button"
        aria-label="Open navigation"
      >
        <KiwiIcon4 size={32} />
      </button>

      <span className="mobile-nav_brand">BuildKiwi</span>

      <button
        type="button"
        className="mobile-nav_button"
        aria-label="Open more options"
      >
        <span className="mobile-nav_menu-icon" aria-hidden="true">
          ☰
        </span>
      </button>
    </header>
  );
}
