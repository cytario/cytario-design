import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends AriaButtonProps {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--color-action-primary)] text-[var(--color-text-inverse)]",
    "hover:bg-[var(--color-action-primary-hover)]",
    "pressed:bg-[var(--color-action-primary-active)]",
  ].join(" "),
  secondary: [
    "bg-transparent text-[var(--color-action-secondary)]",
    "border border-[var(--color-border-brand)]",
    "hover:bg-[var(--color-purple-50)]",
    "pressed:bg-[var(--color-purple-100)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--color-text-primary)]",
    "hover:bg-[var(--color-neutral-100)]",
    "pressed:bg-[var(--color-neutral-200)]",
  ].join(" "),
  destructive: [
    "bg-[var(--color-action-danger)] text-[var(--color-text-inverse)]",
    "hover:bg-[var(--color-action-danger-hover)]",
    "pressed:bg-[var(--color-action-danger-hover)]",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
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
      {isLoading && <Spinner />}
      {children}
    </AriaButton>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
