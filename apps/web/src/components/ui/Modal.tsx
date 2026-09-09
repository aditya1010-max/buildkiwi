import { useEffect, useId } from "react";
import type { ReactNode } from "react";

import "./Modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  className = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const classes = ["ui-modal", className].filter(Boolean).join(" ");

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="ui-modal__overlay" onMouseDown={handleOverlayClick}>
      <div
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <div className="ui-modal__header">
            <h2 id={titleId} className="ui-modal__title">
              {title}
            </h2>

            <button
              type="button"
              className="ui-modal__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        )}

        <div className="ui-modal__content">{children}</div>
      </div>
    </div>
  );
}
