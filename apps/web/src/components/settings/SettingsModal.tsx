import "./SettingsModal.css";

import { useNavigate } from "react-router-dom";

export default function SettingsModal() {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => navigate(-1)}>
          ✕
        </button>

        <h2>Settings</h2>

        <button>🌙 Dark Mode</button>

        <button>☀️ Light Mode</button>

        <button>👤 Account</button>

        <button>🚪 Logout</button>
      </div>
    </div>
  );
}
