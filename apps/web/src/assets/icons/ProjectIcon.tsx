type ProjectIconProps = {
  size?: number;
  className?: string;
};

export function ProjectIcon({ size = 24, className = "" }: ProjectIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M42,18V14a2,2,0,0,0-2-2H23L17,6H4A2,2,0,0,0,2,8V36a6,6,0,0,0,6,6H44a2,2,0,0,0,2-2V20a2,2,0,0,0-2-2ZM6,10h9.3l4.9,4.8L21.3,16H38v2H12a2,2,0,0,0-2,2V35.9A2.1,2.1,0,0,1,8.3,38,2,2,0,0,1,6,36V10Z" />
    </svg>
  );
}
