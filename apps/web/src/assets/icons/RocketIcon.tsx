interface IconProps {
  size?: number;
  className?: string;
}

export function RocketIcon({ size = 20, className }: IconProps) {
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
      <path d="M4.5 19.5L9 15" />
      <path d="M14 10L20 4C18 2 14 2 11 5L7 9L10 14L14 17L18 13C21 10 22 6 20 4" />
      <circle cx="15" cy="9" r="1.2" />
    </svg>
  );
}
