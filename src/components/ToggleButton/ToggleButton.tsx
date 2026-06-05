import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { type Size, sizeStyles } from "../_shared/styles";

export type ToggleButtonVariant = "default" | "primary" | "outlined";
export type ToggleButtonSize = Size;

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

const squareSizeStyles: Record<ToggleButtonSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-7 w-7 text-sm",
  md: "h-8 w-8 text-base",
  lg: "h-10 w-10 text-lg",
};

const variantStyles: Record<ToggleButtonVariant, { base: string; selected: string }> = {
  default: {
    base: [
      "bg-transparent text-(--color-text-primary)",
      "hover:bg-(--color-surface-hover)",
      "pressed:bg-(--color-surface-pressed)",
    ].join(" "),
    selected: "bg-(--color-surface-pressed) text-(--color-text-primary)",
  },
  primary: {
    base: [
      "bg-transparent text-(--color-text-primary)",
      "hover:bg-(--color-surface-hover)",
      "pressed:bg-(--color-surface-pressed)",
    ].join(" "),
    selected: "bg-(--color-action-primary-active) text-(--color-text-inverse)",
  },
  outlined: {
    base: [
      "bg-(--color-surface-default) text-(--color-text-primary)",
      "border border-(--color-border-default)",
      "hover:bg-(--color-surface-subtle)",
      "pressed:bg-(--color-surface-muted)",
    ].join(" "),
    selected: [
      "bg-neutral-800 text-(--color-text-inverse)",
      "border border-neutral-800",
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
          "inline-flex items-center justify-center gap-2 cursor-pointer",
          isSquare ? "rounded-none" : "rounded-md",
          "font-medium",
          "leading-tight",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          isSquare ? squareSizeStyles[size] : sizeStyles[size],
          isSelected ? styles.selected : styles.base,
          className,
        )
      }
    />
  );
}
