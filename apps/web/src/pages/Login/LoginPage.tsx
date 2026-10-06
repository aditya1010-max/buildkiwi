import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  const { loginUser, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginUser(email, password);

      toast.success("Welcome back!", "You have successfully signed in.");

      navigate(from, { replace: true });
    } catch {
      // Error is already handled by the auth hook.
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card_header">
          <h1 className="login-card_title">Welcome back</h1>

          <p className="login-card_subtitle">
            Log in to continue building on BuildKiwi.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form_field">
            <label htmlFor="login-email">Email</label>

            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-form_field">
            <label htmlFor="login-password">Password</label>

            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="login-form_error" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="login-form_button"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="login-card_footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="login-card_link"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </p>
      </section>
    </main>
  );
}
