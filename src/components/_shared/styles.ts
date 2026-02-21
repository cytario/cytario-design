export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "default"
  | "success"
  | "info";

export type ButtonSize = "sm" | "md" | "lg";

export const variantStyles: Record<ButtonVariant, string> = {
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
  default: [
    "bg-[var(--color-action-default)] text-[var(--color-text-inverse)]",
    "hover:bg-[var(--color-action-default-hover)]",
    "pressed:bg-[var(--color-slate-600)]",
  ].join(" "),
  success: [
    "bg-[var(--color-action-success)] text-[var(--color-text-inverse)]",
    "hover:bg-[var(--color-action-success-hover)]",
    "pressed:bg-[var(--color-green-800)]",
  ].join(" "),
  info: [
    "bg-[var(--color-action-info)] text-[var(--color-text-inverse)]",
    "hover:bg-[var(--color-action-info-hover)]",
    "pressed:bg-[var(--color-slate-800)]",
  ].join(" "),
};

export const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
