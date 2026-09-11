import type { HTMLAttributes, ReactNode } from "react";

import "./Badge.css";

type BadgeVariant =
  "default" | "primary" | "accent" | "success" | "warning" | "danger";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  const classes = [
    "ui-badge",
    `ui-badge--${variant}`,
    `ui-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  );
}
