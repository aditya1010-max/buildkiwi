import type { ReactNode } from "react";

import "./Tooltip.css";

type TooltipPlacement = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
}

export default function Tooltip({
  content,
  children,
  placement = "top",
  className = "",
}: TooltipProps) {
  const classes = ["ui-tooltip", `ui-tooltip--${placement}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      <span className="ui-tooltip__trigger">{children}</span>

      <span className="ui-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  );
}
