import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import {
  type ButtonVariant,
  type ButtonSize,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";

export type { ButtonVariant, ButtonSize };

export interface ButtonProps extends AriaButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
  /** Lucide icon rendered before children */
  iconLeft?: LucideIcon;
  /** Lucide icon rendered after children */
  iconRight?: LucideIcon;
}

const iconSizeMap = {
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
  return (
    <AriaButton
      {...props}
      isDisabled={isDisabled || isLoading}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-[var(--border-radius-md)]",
        "font-[var(--font-weight-medium)]",
        "leading-[var(--line-height-tight)]",
        "outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        isLoading ? "pointer-events-none" : "",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading && <Spinner size={iconSizeMap[size]} />}
      {!isLoading && iconLeft && <Icon icon={iconLeft} size={iconSizeMap[size]} />}
      {children as React.ReactNode}
      {!isLoading && iconRight && <Icon icon={iconRight} size={iconSizeMap[size]} />}
    </AriaButton>
  );
}
