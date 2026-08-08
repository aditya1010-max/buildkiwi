import { useNavigate } from "react-router-dom";

import "./GuestSidebarCard.css";

export default function GuestSidebarCard() {
  const navigate = useNavigate();

  return (
    <section className="guest-sidebar-card">
      <div>
        <div className="guest-sidebar-card_icon">🚀</div>

        <h3 className="guest-sidebar-card_title">Join BuildKiwi</h3>
      </div>

      <ul className="guest-sidebar-card_features">
        <li>Create projects</li>
        <li>Save favourites</li>
        <li>Like projects</li>
      </ul>

      <button
        type="button"
        className="guest-sidebar-card_primary"
        onClick={() => navigate("/login")}
      >
        Sign In
      </button>

      <button
        type="button"
        className="guest-sidebar-card_secondary"
        onClick={() => navigate("/register")}
      >
        Create Account
      </button>
    </section>
  );
}
