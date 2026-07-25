import "./MenuHeader.css";

interface MenuHeaderProps {
  title: string;
  onBack: () => void;
}

export default function MenuHeader({ title, onBack }: MenuHeaderProps) {
  return (
    <div className="menu-header">
      <button type="button" className="menu-header__back" onClick={onBack}>
        ←
      </button>

      <h2 className="menu-header__title">{title}</h2>
    </div>
  );
}
