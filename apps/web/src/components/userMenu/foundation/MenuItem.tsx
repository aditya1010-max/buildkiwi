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
      className={`menu-item ${danger ? "menu-item--danger" : ""}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <div className="menu-item_left">
        {icon && <span className="menu-item_icon">{icon}</span>}
        <span className="menu-item_label">{label}</span>
      </div>

      {rightSlot && <span className="menu-item_right">{rightSlot}</span>}
    </button>
  );
}
