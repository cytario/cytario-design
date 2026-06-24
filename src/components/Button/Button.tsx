import type React from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type Size,
  type ButtonVariant,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";
import { Icon, type IconValue } from "../Icon";
import { Spinner } from "../Spinner";

export type { ButtonVariant };
export type ButtonSize = Size;

export interface ButtonProps extends AriaButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: IconValue;
  iconRight?: IconValue;
  className?: string;
}

const iconSizeMap = {
  xs: "sm",
  sm: "sm",
  md: "sm",
  lg: "md",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const cx = twMerge(
    "inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer",
    "rounded-md",
    "font-medium",
    "leading-tight",
    "outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return (
    <AriaButton {...props} isDisabled={isDisabled || isLoading} className={cx}>
      {isLoading && <Spinner size={iconSizeMap[size]} />}
      {!isLoading && iconLeft && (
        <Icon icon={iconLeft} size={iconSizeMap[size]} />
      )}
      {children as React.ReactNode}
      {!isLoading && iconRight && (
        <Icon icon={iconRight} size={iconSizeMap[size]} />
      )}
    </AriaButton>
  );
}
