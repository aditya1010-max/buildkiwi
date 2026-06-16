import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
};

export default function SettingsPopup({ onClose }: Props) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="settings-popup" ref={popupRef}>
      <button className="settings-item" onClick={onClose}>✕ Close </button>

      <button className="settings-item">..........🌙 Dark Mode</button>

      <button className="settings-item">..........☀️ Light Mode </button>

      <button className="settings-item">..........👤 Profile</button>

      <button className="settings-item">..........🚪 Logout</button>

    </div>
  );
}
