import "./LogoutDialog.css";

import Button from "../../ui/Button";

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
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="danger" type="button" onClick={onConfirm}>
          Logout
        </Button>
      </div>
    </div>
  );
}
