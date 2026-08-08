import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { registerUser, loading, error } = useAuth();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerUser(username, email, password);

      navigate("/login");
    } catch {
      // error handled by hook
    }
  };

  return (
    <main className="register-page">
      <div className="register-card">
        <h1 className="register-card_title">Create Account</h1>

        <p className="register-card_subtitle">
          Join BuildKiwi and start sharing projects
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form_field">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="register-form_field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="register-form_field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          {error && <p className="register-form_error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="register-form_button"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <div className="register-card_footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
