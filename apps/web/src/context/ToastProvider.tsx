import { useCallback, useMemo, useState, type ReactNode } from "react";

import ToastContainer from "../components/toast/ToastContainer";
import type { Toast } from "../types/toast";

import { ToastContext } from "./ToastContext";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "info",
      duration = 3000,
    }: {
      title: string;
      description?: string;
      variant?: Toast["variant"];
      duration?: number;
    }) => {
      const id = crypto.randomUUID();

      const toast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      };

      setToasts((current) => [toast, ...current]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
