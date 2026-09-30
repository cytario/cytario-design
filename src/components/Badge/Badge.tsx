import type React from "react";
import { twMerge } from "tailwind-merge";
import { Icon, type IconValue } from "../Icon";
import { MetricText } from "../MetricText";

export type BadgeColor =
  | "primary"
  | "secondary"
  | "neutral"
  | "destructive"
  | "success"
  | "warning";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  children?: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: IconValue;
}

const colorStyles: Record<BadgeColor, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  neutral: "bg-muted text-muted-foreground",
  destructive: "bg-destructive-surface text-destructive-surface-foreground",
  success: "bg-success-surface text-success-surface-foreground",
  warning: "bg-warning-surface text-warning-surface-foreground",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1 py-0 text-[10px]",
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  color = "neutral",
  size = "sm",
  icon,
  className,
  ...rest
}: BadgeProps) {
  return (
    <MetricText
      className={twMerge(
        "inline-flex items-center gap-1 rounded-full",
        colorStyles[color],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon icon={icon} size="xs" />}
      {children}
    </MetricText>
  );
}
