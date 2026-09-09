import "./DocumentationCard.css";
import ChevronRight from "../user-menu/components/ChevronRight";
import Button from "../ui/Button";

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
    <Button
      type="button"
      variant="ghost"
      fullWidth
      className="documentation-card"
      onClick={onClick}
    >
      <div className="documentation-card_icon">{icon}</div>

      <div className="documentation-card_content">
        <h2 className="documentation-card_title">{title}</h2>

        <p className="documentation-card_description">{description}</p>
      </div>

      <div className="documentation-card_arrow">
        <ChevronRight />
      </div>
    </Button>
  );
}
