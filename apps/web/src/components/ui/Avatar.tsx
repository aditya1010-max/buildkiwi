import type { ImgHTMLAttributes } from "react";

import "./Avatar.css";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "width" | "height"
> {
  size?: AvatarSize;
  fallback?: string;
}

export default function Avatar({
  src,
  alt = "",
  size = "md",
  fallback,
  className = "",
  ...props
}: AvatarProps) {
  const classes = ["ui-avatar", `ui-avatar--${size}`, className]
    .filter(Boolean)
    .join(" ");

  if (!src && fallback) {
    return (
      <span className={classes} aria-label={alt}>
        {fallback}
      </span>
    );
  }

  return <img {...props} src={src} alt={alt} className={classes} />;
}
