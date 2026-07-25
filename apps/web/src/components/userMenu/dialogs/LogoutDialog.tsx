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
      <h3 className="logout-dialog__title">Logout?</h3>

      <p className="logout-dialog__message">Are you sure you want to logout?</p>

      <div className="logout-dialog__actions">
        <button
          type="button"
          className="logout-dialog__button logout-dialog__button--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          type="button"
          className="logout-dialog__button logout-dialog__button--danger"
          onClick={onConfirm}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
