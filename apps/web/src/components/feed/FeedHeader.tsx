import { useLocation, useNavigate } from "react-router-dom";

import Button from "../ui/Button";

import "./FeedHeader.css";

type FeedHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function FeedHeader({ title, subtitle }: FeedHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleCreate(): void {
    navigate("/create", {
      state: {
        background: location,
      },
    });
  }

  return (
    <header className="feed-header">
      <div>
        <h1 className="feed-header_title">{title}</h1>

        {subtitle && <p className="feed-header_subtitle">{subtitle}</p>}
      </div>

      <Button
        size="md"
        className="feed-header_create-button"
        onClick={handleCreate}
      >
        + Create
      </Button>
    </header>
  );
}
