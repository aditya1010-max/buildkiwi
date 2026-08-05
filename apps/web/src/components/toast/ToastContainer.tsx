import { useToastContext } from "../../context/ToastContext";
import Toast from "./Toast";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
