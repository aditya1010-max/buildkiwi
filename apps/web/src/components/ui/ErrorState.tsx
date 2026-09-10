import type { ReactNode } from "react";

import Button from "./Button";

import "./ErrorState.css";

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  action,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const classes = ["ui-error-state", className].filter(Boolean).join(" ");

  return (
    <div className={classes} role="alert">
      <div className="ui-error-state__icon" aria-hidden="true">
        !
      </div>

      <div className="ui-error-state__content">
        <h2 className="ui-error-state__title">{title}</h2>

        <p className="ui-error-state__message">{message}</p>
      </div>

      {(onRetry || action) && (
        <div className="ui-error-state__actions">
          {onRetry && <Button onClick={onRetry}>Try again</Button>}

          {action}
        </div>
      )}
    </div>
  );
}
