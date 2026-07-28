interface IconProps {
  size?: number;
  className?: string;
}

export function BookOpenIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 6a2 2 0 0 1 2-2h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4a2 2 0 0 0-2 2V6z" />
      <path d="M22 6a2 2 0 0 0-2-2h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6a2 2 0 0 1 2 2V6z" />
    </svg>
  );
}
