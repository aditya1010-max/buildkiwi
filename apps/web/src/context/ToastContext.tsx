import { createContext } from "react";

import type { Toast, ToastVariant } from "../types/toast";

export interface ShowToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (options: ShowToastOptions) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
