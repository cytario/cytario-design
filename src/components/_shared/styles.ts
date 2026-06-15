/* ── Shared sizes ── */

export type Size = "xs" | "sm" | "md" | "lg";

export const sizeStyles: Record<Size, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/* ── Button ── */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "neutral"
  | "outline"
  | "ghost";

export const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-primary-hover",
    "pressed:bg-primary-active",
  ].join(" "),
  secondary: [
    "bg-secondary text-secondary-foreground",
    "hover:bg-secondary-hover",
    "pressed:bg-secondary-hover",
  ].join(" "),
  destructive: [
    "bg-destructive text-destructive-foreground",
    "hover:bg-destructive-hover",
    "pressed:bg-destructive-hover",
  ].join(" "),
  success: [
    "bg-success text-success-foreground",
    "hover:bg-success-hover",
    "pressed:bg-success-hover",
  ].join(" "),
  warning: [
    "bg-warning text-warning-foreground",
    "hover:bg-warning-hover",
    "pressed:bg-warning-hover",
  ].join(" "),
  info: [
    "bg-info text-info-foreground",
    "hover:bg-info-hover",
    "pressed:bg-info-hover",
  ].join(" "),
  neutral: [
    "bg-muted text-foreground",
    "hover:bg-accent",
    "pressed:bg-accent",
  ].join(" "),
  outline: [
    "bg-transparent text-foreground",
    "border border-border",
    "hover:bg-accent",
    "pressed:bg-accent",
  ].join(" "),
  ghost: [
    "bg-transparent text-foreground",
    "hover:bg-accent",
    "pressed:bg-accent",
  ].join(" "),
};
