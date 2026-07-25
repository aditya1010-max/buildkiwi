import "./MenuItem.css";

interface MenuItemProps {
  label: string;
  icon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function MenuItem({
  label,
  icon,
  rightSlot,
  danger = false,
  disabled = false,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`menu-item ${danger ? "menu-item--danger" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="menu-item__left">
        {icon && <span className="menu-item__icon">{icon}</span>}

        <span className="menu-item__label">{label}</span>
      </div>

      {rightSlot && <span className="menu-item__right">{rightSlot}</span>}
    </button>
  );
}
