import "./GuestPrompt.css";

import { useNavigate } from "react-router-dom";

interface GuestPromptProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function GuestPrompt({
  title,
  description,
  icon,
}: GuestPromptProps) {
  const navigate = useNavigate();

  return (
    <section className="guest-prompt">
      <div className="guest-prompt_icon">{icon || "🔒"}</div>

      <h2 className="guest-prompt_title">{title}</h2>

      <p className="guest-prompt_description">{description}</p>

      <div className="guest-prompt_actions">
        <button
          type="button"
          className="guest-prompt_primary"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>

        <button
          type="button"
          className="guest-prompt_secondary"
          onClick={() => navigate("/register")}
        >
          Create Account
        </button>
      </div>
    </section>
  );
}
