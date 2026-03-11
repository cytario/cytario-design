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
    "bg-(--color-badge-neutral-bg) text-(--color-badge-neutral-text)",
  purple:
    "bg-(--color-badge-purple-bg) text-(--color-badge-purple-text)",
  teal: "bg-(--color-badge-teal-bg) text-(--color-badge-teal-text)",
  rose: "bg-(--color-badge-rose-bg) text-(--color-badge-rose-text)",
  slate:
    "bg-(--color-badge-slate-bg) text-(--color-badge-slate-text)",
  green:
    "bg-(--color-badge-green-bg) text-(--color-badge-green-text)",
  amber:
    "bg-(--color-badge-amber-bg) text-(--color-badge-amber-text)",
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
        "inline-flex items-center gap-1 rounded-full",
        "text-xs font-medium leading-tight",
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
