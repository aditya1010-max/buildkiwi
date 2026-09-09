import type { HTMLAttributes, ReactNode } from "react";

import "./Card.css";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: CardPadding;
  interactive?: boolean;
}

export default function Card({
  children,
  padding = "md",
  interactive = false,
  className = "",
  ...props
}: CardProps) {
  const classes = [
    "ui-card",
    `ui-card--padding-${padding}`,
    interactive ? "ui-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}
