import "./WelcomePage.css";

import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <div className="welcome-page__content">
        <div className="welcome-page__logo">🥝</div>

        <h1>Welcome to BuildKiwi</h1>

        <p className="welcome-page__description">
          Discover inspiring developer projects, share your own work and connect
          with builders from around the world.
        </p>

        <div className="welcome-page__actions">
          <button
            className="welcome-page__primary"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

          <button
            className="welcome-page__secondary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button
            className="welcome-page__guest"
            onClick={() => navigate("/home")}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </main>
  );
}
