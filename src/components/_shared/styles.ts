/* ── Shared sizes ── */

export type Size = "sm" | "md" | "lg";

export const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/* ── Button ── */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "default"
  | "success"
  | "info"
  | "neutral";

export const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-(--color-action-primary) text-(--color-text-inverse)",
    "hover:bg-(--color-action-primary-hover)",
    "pressed:bg-(--color-action-primary-active)",
  ].join(" "),
  secondary: [
    "bg-transparent text-(--color-action-secondary)",
    "border border-(--color-border-brand)",
    "hover:bg-purple-50",
    "pressed:bg-purple-100",
  ].join(" "),
  ghost: [
    "bg-transparent text-(--color-text-primary)",
    "hover:bg-(--color-surface-hover)",
    "pressed:bg-(--color-surface-pressed)",
  ].join(" "),
  destructive: [
    "bg-(--color-action-danger) text-(--color-text-inverse)",
    "hover:bg-(--color-action-danger-hover)",
    "pressed:bg-(--color-action-danger-hover)",
  ].join(" "),
  default: [
    "bg-(--color-action-default) text-(--color-text-inverse)",
    "hover:bg-(--color-action-default-hover)",
    "pressed:bg-slate-600",
  ].join(" "),
  success: [
    "bg-(--color-action-success) text-(--color-text-inverse)",
    "hover:bg-(--color-action-success-hover)",
    "pressed:bg-green-800",
  ].join(" "),
  info: [
    "bg-(--color-action-info) text-(--color-text-inverse)",
    "hover:bg-(--color-action-info-hover)",
    "pressed:bg-slate-800",
  ].join(" "),
  neutral: [
    "bg-(--color-surface-default) text-(--color-text-primary)",
    "border border-(--color-border-default)",
    "hover:bg-(--color-surface-subtle)",
    "pressed:bg-(--color-surface-muted)",
  ].join(" "),
};
