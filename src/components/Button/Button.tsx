import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  type ButtonSize,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";
import { useInputGroup } from "../InputGroup/InputGroupContext";

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

function groupRadiusClass(
  position: "start" | "middle" | "end" | "standalone",
): string {
  switch (position) {
    case "start":
      return "rounded-l-[var(--border-radius-md)] rounded-r-none";
    case "middle":
      return "rounded-none";
    case "end":
      return "rounded-r-[var(--border-radius-md)] rounded-l-none";
    default:
      return "rounded-[var(--border-radius-md)]";
  }
}

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
  const { inGroup, position } = useInputGroup();

  const radiusClass = inGroup
    ? groupRadiusClass(position)
    : "rounded-[var(--border-radius-md)]";

  const marginClass =
    inGroup && position !== "start" && position !== "standalone"
      ? "-ml-px"
      : "";

  const focusRing = inGroup
    ? "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-0 focus-visible:z-10"
    : "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2";

  return (
    <AriaButton
      {...props}
      isDisabled={isDisabled || isLoading}
      className={twMerge(
        "inline-flex items-center justify-center gap-2 shrink-0",
        radiusClass,
        "font-[var(--font-weight-medium)]",
        "leading-[var(--line-height-tight)]",
        "outline-none transition-colors",
        focusRing,
        "disabled:opacity-50 disabled:pointer-events-none",
        isLoading ? "pointer-events-none" : "",
        variantStyles[variant],
        sizeStyles[size],
        marginClass,
        className as string,
      )}
    >
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
