import type { LucideIcon } from "lucide-react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { type ButtonVariant, variantStyles } from "../_shared/styles";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";
import { Tooltip } from "../Tooltip";
import { useInputGroup } from "../InputGroup/InputGroupContext";

export interface IconButtonProps extends Omit<AriaButtonProps, "className"> {
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
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const squareWidthOnly = {
  sm: "w-8",
  md: "w-10",
  lg: "w-12",
} as const;

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

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  showTooltip = true,
  tooltipPlacement = "top",
  isLoading = false,
  isDisabled,
  className,
  ...props
}: IconButtonProps) {
  const { inGroup, position } = useInputGroup();

  const groupGhost =
    inGroup && variant === "ghost"
      ? "bg-[var(--color-surface-default)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] pressed:bg-[var(--color-surface-pressed)] pressed:text-[var(--color-text-primary)]"
      : "";

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

  const button = (
    <AriaButton
      {...props}
      aria-label={ariaLabel}
      isDisabled={isDisabled || isLoading}
      className={[
        "inline-flex items-center justify-center shrink-0",
        radiusClass,
        "outline-none transition-colors",
        focusRing,
        "disabled:opacity-50 disabled:pointer-events-none",
        isLoading ? "pointer-events-none" : "",
        groupGhost || variantStyles[variant],
        inGroup ? squareWidthOnly[size] : squareSizeStyles[size],
        marginClass,
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
      <Tooltip content={ariaLabel} placement={tooltipPlacement}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
