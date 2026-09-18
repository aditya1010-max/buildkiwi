type TrendIconProps = {
  size?: number;
  className?: string;
};

export function TrendIcon({ size = 24, className = "" }: TrendIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40.9999 27.0007L40.9999 15.0007L29 15.0007"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6 37.0002L16.3385 24.5002L26.1846 30.5002L41 15.0002"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
