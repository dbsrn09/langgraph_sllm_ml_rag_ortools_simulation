import React from "react";

type AiIconProps = {
  size?: number | string;
  className?: string;
  startColor?: string;
  endColor?: string;
};

export const AiIcon: React.FC<AiIconProps> = ({
  size = 28,
  className = "",
  startColor = "#FB923C",
  endColor = "#EA580C",
}) => {

  const gradientId = React.useId();

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 4L14.4 9.6C14.7 10.3 15.3 10.9 16 11.2L21.5 13.5L16 15.8C15.3 16.1 14.7 16.7 14.4 17.4L12 23L9.6 17.4C9.3 16.7 8.7 16.1 8 15.8L2.5 13.5L8 11.2C8.7 10.9 9.3 10.3 9.6 9.6L12 4Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="2.5"
          y1="4"
          x2="21.5"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={startColor} />
          <stop offset="1" stopColor={endColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};
