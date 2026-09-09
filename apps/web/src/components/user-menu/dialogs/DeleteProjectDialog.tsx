import { createPortal } from "react-dom";
import "./DeleteProjectDialog.css";

interface DeleteProjectDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteProjectDialog({
  onCancel,
  onConfirm,
  isDeleting = false,
}: DeleteProjectDialogProps) {
  return createPortal(
    <div className="delete-project-dialog_backdrop">
      <div
        className="delete-project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-dialog-title"
      >
        <h2 id="delete-project-dialog-title">Delete project?</h2>

        <p>
          This action cannot be undone. Are you sure you want to permanently
          delete this project?
        </p>

        <div className="delete-project-dialog_actions">
          <button type="button" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>

          <button type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
