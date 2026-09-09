import "./Loader.css";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
  label?: string;
  className?: string;
}

export default function Loader({
  size = "md",
  label,
  className = "",
}: LoaderProps) {
  const classes = ["ui-loader", `ui-loader--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-label={label ?? "Loading"}>
      <span className="ui-loader__spinner" aria-hidden="true" />

      {label && <span className="ui-loader__label">{label}</span>}
    </div>
  );
}
