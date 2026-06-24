import type { LucideIcon } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { type ButtonVariant, variantStyles } from "../_shared/styles";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";
import { Tooltip } from "../Tooltip";

export interface IconButtonProps extends Omit<AriaButtonProps, "className"> {
  /** Lucide icon to render */
  icon: LucideIcon;
  /** Required for accessibility — also used as tooltip content */
  "aria-label": string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const iconSizeMap = {
  xs: "sm",
  sm: "sm",
  md: "sm",
  lg: "md",
} as const;

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  showTooltip = true,
  isLoading = false,
  isDisabled,
  className,
  ...props
}: IconButtonProps) {
  const button = (
    <AriaButton
      {...props}
      aria-label={ariaLabel}
      isDisabled={isDisabled || isLoading}
      className={[
        "inline-flex items-center justify-center shrink-0 cursor-pointer",
        "rounded-md",
        "outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        isLoading ? "pointer-events-none" : "",
        variantStyles[variant],
        squareSizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading ? (
        <Spinner size={iconSizeMap[size]} />
      ) : (
        <Icon icon={icon} size={iconSizeMap[size]} />
      )}
    </AriaButton>
  );

  if (showTooltip) {
    return (
      <Tooltip content={ariaLabel}>{button}</Tooltip>
    );
  }

  return button;
}
