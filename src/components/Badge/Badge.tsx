import type React from "react";
import { twMerge } from "tailwind-merge";
import { Icon, type IconValue } from "../Icon";

export type BadgeColor =
  | "purple"
  | "teal"
  | "rose"
  | "slate"
  | "green"
  | "amber";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  children?: React.ReactNode;
  color?: BadgeColor;
  size?: BadgeSize;
  icon?: IconValue;
}

const colorStyles: Record<BadgeColor, string> = {
  purple:
    "bg-badge-purple-bg text-badge-purple-text border-badge-purple-text/20",
  teal: "bg-badge-teal-bg text-badge-teal-text border-badge-teal-text/20",
  rose: "bg-badge-rose-bg text-badge-rose-text border-badge-rose-text/20",
  slate: "bg-badge-slate-bg text-badge-slate-text border-badge-slate-text/20",
  green: "bg-badge-green-bg text-badge-green-text border-badge-green-text/20",
  amber: "bg-badge-amber-bg text-badge-amber-text border-badge-amber-text/20",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1 py-0 text-[10px]",
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  color = "slate",
  size = "sm",
  icon,
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 rounded-full border",
        "font-medium leading-tight tracking-wider tabular-nums",
        colorStyles[color],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon icon={icon} size="xs" />}
      {children}
    </span>
  );
}
