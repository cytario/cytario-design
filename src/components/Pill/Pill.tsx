import type React from "react";
import { twMerge } from "tailwind-merge";

const hashColors = {
  purple: "bg-(--color-badge-purple-bg) text-(--color-badge-purple-text) border-(--color-badge-purple-text)/20",
  teal: "bg-(--color-badge-teal-bg) text-(--color-badge-teal-text) border-(--color-badge-teal-text)/20",
  rose: "bg-(--color-badge-rose-bg) text-(--color-badge-rose-text) border-(--color-badge-rose-text)/20",
  green: "bg-(--color-badge-green-bg) text-(--color-badge-green-text) border-(--color-badge-green-text)/20",
  amber: "bg-(--color-badge-amber-bg) text-(--color-badge-amber-text) border-(--color-badge-amber-text)/20",
} as const;

export const colorStyles = {
  ...hashColors,
  slate:
    "bg-(--color-badge-slate-bg) text-(--color-badge-slate-text) border-(--color-badge-slate-text)/20",
} as const;

export type PillColor = keyof typeof colorStyles;

export interface PillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children" | "color"> {
  children?: string;
  color?: PillColor;
}

const hashKeys = Object.keys(hashColors) as (keyof typeof hashColors)[];

export function pillColorFromName(name = ""): PillColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hashKeys[Math.abs(hash) % hashKeys.length];
}

/** Non-interactive hash-colored label badge. Color is derived from the text unless explicitly set. */
export function Pill({
  children,
  color = pillColorFromName(children),
  className,
  ...rest
}: PillProps) {
  const cx = twMerge(
    `
    inline-flex items-center
    rounded-full
    border
    px-2 py-0.5
    text-xs font-medium
    leading-tight
    `,
    colorStyles[color],
    className,
  );

  return (
    <span className={cx} {...rest}>
      {children}
    </span>
  );
}
