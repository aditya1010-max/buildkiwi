import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

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
      // Error is already handled by the auth hook.
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-card_header">
          <h1 className="register-card_title">Create your account</h1>

          <p className="register-card_subtitle">
            Join BuildKiwi and start sharing your projects.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form_field">
            <label htmlFor="register-username">Username</label>

            <Input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              required
            />
          </div>

          <div className="register-form_field">
            <label htmlFor="register-email">Email</label>

            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="register-form_field">
            <label htmlFor="register-password">Password</label>

            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="register-form_error" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="register-form_button"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <div className="register-card_footer">
            <span>Already have an account?</span>{" "}
            <Link to="/login">Log in</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
