import { useNavigate } from "react-router-dom";

import "./GuestSidebarCard.css";

export default function GuestSidebarCard() {
  const navigate = useNavigate();

  return (
    <section className="guest-sidebar-card">
      <div>
        <div className="guest-sidebar-card__icon">🚀</div>

        <h3 className="guest-sidebar-card__title">Join BuildKiwi</h3>
      </div>

      <ul className="guest-sidebar-card__features">
        <li>Create projects</li>
        <li>Save favourites</li>
        <li>Like projects</li>
      </ul>

      <button
        type="button"
        className="guest-sidebar-card__primary"
        onClick={() => navigate("/login")}
      >
        Sign In
      </button>

      <button
        type="button"
        className="guest-sidebar-card__secondary"
        onClick={() => navigate("/register")}
      >
        Create Account
      </button>
    </section>
  );
}
