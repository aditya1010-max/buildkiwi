import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = (location.state as { from?: Location })?.from?.pathname || "/";
  console.count("LoginPage mounted");
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
      // error already handled in hook
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">Welcome Back</h1>

        <p className="login-card__subtitle">
          Log in to continue building on BuildKiwi
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form__field">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-form__field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="login-form__error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="login-form__button"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
