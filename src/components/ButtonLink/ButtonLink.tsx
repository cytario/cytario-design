import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  type ButtonSize,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";
import { Icon } from "../Icon";
import { Tooltip } from "../Tooltip";

export type { ButtonVariant, ButtonSize };

export interface ButtonLinkProps extends Omit<AriaLinkProps, "className"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Lucide icon rendered before children */
  iconLeft?: LucideIcon;
  /** Lucide icon rendered after children */
  iconRight?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
}

const iconSizeMap = {
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
        "inline-flex items-center justify-center gap-2",
        "rounded-[var(--border-radius-md)]",
        "font-[var(--font-weight-medium)]",
        "leading-[var(--line-height-tight)]",
        "outline-none transition-colors no-underline",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
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
  /** Lucide icon to render */
  icon: LucideIcon;
  /** Required for accessibility — also used as tooltip content */
  "aria-label": string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
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
  tooltipPlacement = "top",
  className,
  ...props
}: IconButtonLinkProps) {
  const link = (
    <AriaLink
      {...props}
      aria-label={ariaLabel}
      className={twMerge(
        "inline-flex items-center justify-center",
        "rounded-[var(--border-radius-md)]",
        "outline-none transition-colors no-underline",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
        variantStyles[variant],
        squareSizeStyles[size],
        className,
      )}
    >
      <Icon icon={icon} size={iconSizeMap[size]} />
    </AriaLink>
  );

  if (showTooltip) {
    return (
      <Tooltip content={ariaLabel} placement={tooltipPlacement}>
        {link}
      </Tooltip>
    );
  }

  return link;
}
