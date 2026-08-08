import "./WelcomePage.css";

import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <div className="welcome-page_content">
        <div className="welcome-page_logo">🥝</div>

        <h1>Welcome to BuildKiwi</h1>

        <p className="welcome-page_description">
          Discover inspiring developer projects, share your own work and connect
          with builders from around the world.
        </p>

        <div className="welcome-page_actions">
          <button
            className="welcome-page_primary"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>

          <button
            className="welcome-page_secondary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>

          <button className="welcome-page_guest" onClick={() => navigate("/")}>
            Continue as Guest
          </button>
        </div>
      </div>
    </main>
  );
}
