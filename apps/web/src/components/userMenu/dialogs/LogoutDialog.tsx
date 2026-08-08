import "./LogoutDialog.css";

interface LogoutDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutDialog({
  onCancel,
  onConfirm,
}: LogoutDialogProps) {
  return (
    <div className="logout-dialog">
      <h3 className="logout-dialog_title">Logout?</h3>

      <p className="logout-dialog_message">Are you sure you want to logout?</p>

      <div className="logout-dialog_actions">
        <button
          type="button"
          className="logout-dialog_button logout-dialog_button--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="logout-dialog_button logout-dialog_button--danger"
          onClick={onConfirm}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
