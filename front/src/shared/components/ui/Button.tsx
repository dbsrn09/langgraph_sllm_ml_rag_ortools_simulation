import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  Icon?: React.ElementType;
  IconClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  className,
  Icon,
  IconClassName,
  ...rest
}) => {
  return (
    <button className={className} {...rest}>
      {Icon && <Icon className={IconClassName} />}
      {text}
    </button>
  );
};
