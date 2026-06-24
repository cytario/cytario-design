import type React from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type Size,
  type ButtonVariant,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";
import { Icon, type IconValue } from "../Icon";
import { Tooltip } from "../Tooltip";

export type { ButtonVariant };
export type ButtonSize = Size;

export interface ButtonLinkProps extends AriaLinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
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

export function ButtonLink({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <AriaLink
      {...props}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 cursor-pointer",
        "rounded-md",
        "font-medium",
        "leading-tight",
        "outline-none transition-colors no-underline",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {iconLeft && <Icon icon={iconLeft} size={iconSizeMap[size]} />}
      {children as React.ReactNode}
      {iconRight && <Icon icon={iconRight} size={iconSizeMap[size]} />}
    </AriaLink>
  );
}

// --- IconButtonLink ---

export interface IconButtonLinkProps extends Omit<AriaLinkProps, "className"> {
  /** Icon to render */
  icon: IconValue;
  /** Required for accessibility — also used as tooltip content */
  "aria-label": string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

export function IconButtonLink({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  showTooltip = true,
  className,
  ...props
}: IconButtonLinkProps) {
  const link = (
    <AriaLink
      {...props}
      aria-label={ariaLabel}
      className={twMerge(
        "inline-flex items-center justify-center cursor-pointer",
        "rounded-md",
        "outline-none transition-colors no-underline",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variantStyles[variant],
        squareSizeStyles[size],
        className,
      )}
    >
      <Icon icon={icon} size={iconSizeMap[size]} />
    </AriaLink>
  );

  if (showTooltip) {
    return <Tooltip content={ariaLabel}>{link}</Tooltip>;
  }

  return link;
}
