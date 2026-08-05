import type { Toast as ToastType } from "../../types/toast";
import "./Toast.css";

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <div className={`toast toast--${toast.variant}`} role="status">
      <div className="toast__content">
        <h4 className="toast__title">{toast.title}</h4>

        {toast.description && (
          <p className="toast__description">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        className="toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
