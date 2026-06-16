import { Link, useLocation } from "react-router-dom";
import "./FeedHeader.css";

type FeedHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function FeedHeader({ title, subtitle }: FeedHeaderProps) {
  const location = useLocation();
  return (
    <header className="feed-header">
      <div>
        <h1 className="feed-header__title">{title}</h1>
        {subtitle && <p className="feed-header__subtitle">{subtitle}</p>}
      </div>
      <button className="feed-header__button">
        <Link to="/create" state={{ background: location }}>
          + Create
        </Link>
      </button>
    </header>
  );
}
