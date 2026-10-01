import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import "./GuestSidebarCard.css";

export default function GuestSidebarCard() {
  const navigate = useNavigate();

  return (
    <section className="guest-sidebar-card">
      <h3 className="guest-sidebar-card_title">A community for builders.</h3>

      <p className="guest-sidebar-card_description">
        Share your projects, discover what others are building, and grow
        together.
      </p>

      <Button size="sm" fullWidth onClick={() => navigate("/login")}>
        Sign In
      </Button>

      <Button
        variant="secondary"
        size="sm"
        fullWidth
        onClick={() => navigate("/register")}
      >
        Create Account
      </Button>
    </section>
  );
}
