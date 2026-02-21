import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";

export type ToggleButtonVariant = "default" | "primary";
export type ToggleButtonSize = "sm" | "md" | "lg";

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className"> {
  /** Visual style variant */
  variant?: ToggleButtonVariant;
  /** Size preset */
  size?: ToggleButtonSize;
  /** Additional CSS classes */
  className?: string;
}

const sizeStyles: Record<ToggleButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variantStyles: Record<ToggleButtonVariant, { base: string; selected: string }> = {
  default: {
    base: [
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-neutral-100)]",
      "pressed:bg-[var(--color-neutral-200)]",
    ].join(" "),
    selected: "bg-[var(--color-neutral-200)] text-[var(--color-text-primary)]",
  },
  primary: {
    base: [
      "bg-transparent text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-neutral-100)]",
      "pressed:bg-[var(--color-neutral-200)]",
    ].join(" "),
    selected: "bg-[var(--color-teal-500)] text-[var(--color-text-inverse)]",
  },
};

export function ToggleButton({
  variant = "default",
  size = "md",
  className,
  ...props
}: ToggleButtonProps) {
  const styles = variantStyles[variant];

  return (
    <AriaToggleButton
      {...props}
      className={({ isSelected }) =>
        [
          "inline-flex items-center justify-center gap-2",
          "rounded-[var(--border-radius-md)]",
          "font-[var(--font-weight-medium)]",
          "leading-[var(--line-height-tight)]",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          sizeStyles[size],
          isSelected ? styles.selected : styles.base,
          className,
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  );
}
