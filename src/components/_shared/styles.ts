export type ButtonSize = "xs" | "sm" | "md" | "lg";

export const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const iconSizeMap = {
  xs: "sm",
  sm: "sm",
  md: "sm",
  lg: "md",
} as const;

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
  primary: `
    bg-primary text-primary-foreground
    hover:bg-primary-hover
    pressed:bg-primary-pressed
  `,
  secondary: `
    bg-secondary text-secondary-foreground
    hover:bg-secondary-hover
    pressed:bg-secondary-pressed
  `,
  destructive: `
    bg-destructive text-destructive-foreground
    hover:bg-destructive-hover
    pressed:bg-destructive-pressed
  `,
  success: `
    bg-success text-success-foreground
    hover:bg-success-hover
    pressed:bg-success-pressed
  `,
  warning: `
    bg-warning text-warning-foreground
    hover:bg-warning-hover
    pressed:bg-warning-pressed
  `,
  info: `
    bg-info text-info-foreground
    hover:bg-info-hover
    pressed:bg-info-pressed
  `,
  neutral: `
    bg-muted text-foreground
    hover:bg-accent
    pressed:bg-accent-pressed
  `,
  outline: `
    bg-transparent text-foreground
    border border-border
    hover:bg-muted
    pressed:bg-accent-pressed
  `,
  ghost: `
    bg-transparent text-foreground
    hover:bg-muted
    pressed:bg-accent-pressed
  `,
};
