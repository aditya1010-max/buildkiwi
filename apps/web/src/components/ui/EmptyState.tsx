import type { ReactNode } from "react";

import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  message,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  const classes = ["ui-empty-state", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {icon && (
        <div className="ui-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="ui-empty-state__content">
        <h2 className="ui-empty-state__title">{title}</h2>

        {message && <p className="ui-empty-state__message">{message}</p>}
      </div>

      {action && <div className="ui-empty-state__action">{action}</div>}
    </div>
  );
}
