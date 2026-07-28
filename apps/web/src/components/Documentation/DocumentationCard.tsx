import "./DocumentationCard.css";
import ChevronRight from "../userMenu/components/ChevronRight";

interface DocumentationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export default function DocumentationCard({
  title,
  description,
  icon,
  onClick,
}: DocumentationCardProps) {
  return (
    <button type="button" className="documentation-card" onClick={onClick}>
      <div className="documentation-card__icon">{icon}</div>

      <div className="documentation-card__content">
        <h2 className="documentation-card__title">{title}</h2>

        <p className="documentation-card__description">{description}</p>
      </div>

      <div className="documentation-card__arrow">
        <ChevronRight />
      </div>
    </button>
  );
}
