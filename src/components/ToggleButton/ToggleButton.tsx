import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export type ToggleButtonVariant = "default" | "primary" | "outlined";
export type ToggleButtonSize = "sm" | "md" | "lg";

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className"> {
  /** Visual style variant */
  variant?: ToggleButtonVariant;
  /** Size preset */
  size?: ToggleButtonSize;
  /** Use fixed square dimensions instead of padding-based sizing */
  isSquare?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles: Record<ToggleButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const squareSizeStyles: Record<ToggleButtonSize, string> = {
  sm: "h-7 w-7 text-sm",
  md: "h-8 w-8 text-base",
  lg: "h-10 w-10 text-lg",
};

const variantStyles: Record<ToggleButtonVariant, { base: string; selected: string }> = {
  default: {
    base: [
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-surface-hover)]",
      "pressed:bg-[var(--color-surface-pressed)]",
    ].join(" "),
    selected: "bg-[var(--color-surface-pressed)] text-[var(--color-text-primary)]",
  },
  primary: {
    base: [
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-surface-hover)]",
      "pressed:bg-[var(--color-surface-pressed)]",
    ].join(" "),
    selected: "bg-[var(--color-action-primary-active)] text-[var(--color-text-inverse)]",
  },
  outlined: {
    base: [
      "bg-[var(--color-surface-default)] text-[var(--color-text-primary)]",
      "border border-[var(--color-border-default)]",
      "hover:bg-[var(--color-surface-subtle)]",
      "pressed:bg-[var(--color-surface-muted)]",
    ].join(" "),
    selected: [
      "bg-[var(--color-neutral-800)] text-[var(--color-text-inverse)]",
      "border border-[var(--color-neutral-800)]",
    ].join(" "),
  },
};

export function ToggleButton({
  variant = "default",
  size = "md",
  isSquare = false,
  className,
  ...props
}: ToggleButtonProps) {
  const styles = variantStyles[variant];

  return (
    <AriaToggleButton
      {...props}
      className={({ isSelected }) =>
        twMerge(
          "inline-flex items-center justify-center gap-2",
          isSquare ? "rounded-none" : "rounded-[var(--border-radius-md)]",
          "font-[var(--font-weight-medium)]",
          "leading-[var(--line-height-tight)]",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          isSquare ? squareSizeStyles[size] : sizeStyles[size],
          isSelected ? styles.selected : styles.base,
          className,
        )
      }
    />
  );
}
