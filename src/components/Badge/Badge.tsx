import type React from "react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

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
  icon?: LucideIcon;
  /** Merge override */
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    "bg-[var(--color-badge-neutral-bg)] text-[var(--color-badge-neutral-text)]",
  purple:
    "bg-[var(--color-badge-purple-bg)] text-[var(--color-badge-purple-text)]",
  teal: "bg-[var(--color-badge-teal-bg)] text-[var(--color-badge-teal-text)]",
  rose: "bg-[var(--color-badge-rose-bg)] text-[var(--color-badge-rose-text)]",
  slate:
    "bg-[var(--color-badge-slate-bg)] text-[var(--color-badge-slate-text)]",
  green:
    "bg-[var(--color-badge-green-bg)] text-[var(--color-badge-green-text)]",
  amber:
    "bg-[var(--color-badge-amber-bg)] text-[var(--color-badge-amber-text)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5",
  md: "px-2 py-0.5",
};

const iconSizeMap: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon: IconComponent,
  className,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 rounded-[var(--border-radius-full)]",
        "text-[length:var(--font-size-xs)] font-[number:var(--font-weight-medium)] leading-[var(--line-height-tight)]",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {IconComponent && (
        <IconComponent size={iconSizeMap[size]} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
