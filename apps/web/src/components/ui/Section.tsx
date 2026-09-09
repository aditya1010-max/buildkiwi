//later
import type { HTMLAttributes, ReactNode } from "react";

import "./Section.css";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function Section({
  title,
  description,
  actions,
  children,
  className = "",
  ...props
}: SectionProps) {
  const classes = ["ui-section", className].filter(Boolean).join(" ");

  return (
    <section {...props} className={classes}>
      {(title || description || actions) && (
        <header className="ui-section__header">
          <div className="ui-section__heading">
            {title && <h2 className="ui-section__title">{title}</h2>}

            {description && (
              <p className="ui-section__description">{description}</p>
            )}
          </div>

          {actions && <div className="ui-section__actions">{actions}</div>}
        </header>
      )}

      <div className="ui-section__content">{children}</div>
    </section>
  );
}
