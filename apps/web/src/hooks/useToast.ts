import { useToastContext } from "../context/ToastContext";

import { useMemo } from "react";

export function useToast() {
  const { showToast } = useToastContext();

  return useMemo(
    () => ({
      success(title: string, description?: string) {
        showToast({
          title,
          description,
          variant: "success",
        });
      },

      error(title: string, description?: string) {
        showToast({
          title,
          description,
          variant: "error",
        });
      },

      warning(title: string, description?: string) {
        showToast({
          title,
          description,
          variant: "warning",
        });
      },

      info(title: string, description?: string) {
        showToast({
          title,
          description,
          variant: "info",
        });
      },

      show: showToast,
    }),
    [showToast],
  );
}
