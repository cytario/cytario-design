import type React from "react";
import { twMerge } from "tailwind-merge";
import { Icon, type IconValue } from "../Icon";

export type BadgeVariant =
  | "neutral"
  | "purple"
  | "teal"
  | "rose"
  | "slate"
  | "green"
  | "amber";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  /** Badge text content */
  children: React.ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size preset */
  size?: BadgeSize;
  /** Optional leading icon */
  icon?: IconValue;
  /** Merge override */
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: "bg-badge-neutral-bg text-badge-neutral-text",
  purple: "bg-badge-purple-bg text-badge-purple-text",
  teal: "bg-badge-teal-bg text-badge-teal-text",
  rose: "bg-badge-rose-bg text-badge-rose-text",
  slate: "bg-badge-slate-bg text-badge-slate-text",
  green: "bg-badge-green-bg text-badge-green-text",
  amber: "bg-badge-amber-bg text-badge-amber-text",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5",
  md: "px-2 py-0.5",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 rounded-full",
        "text-xs font-medium leading-tight tracking-wider tabular-nums",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {icon && <Icon icon={icon} size="xs" />}
      {children}
    </span>
  );
}
