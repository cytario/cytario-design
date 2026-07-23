import type React from "react";
import { twMerge } from "tailwind-merge";

const hashColors = {
  purple:
    "bg-badge-purple-bg text-badge-purple-text border-badge-purple-text/20",
  teal: "bg-badge-teal-bg text-badge-teal-text border-badge-teal-text/20",
  rose: "bg-badge-rose-bg text-badge-rose-text border-badge-rose-text/20",
  green: "bg-badge-green-bg text-badge-green-text border-badge-green-text/20",
  amber: "bg-badge-amber-bg text-badge-amber-text border-badge-amber-text/20",
};

export const colorStyles = {
  ...hashColors,
  slate: "bg-badge-slate-bg text-badge-slate-text border-badge-slate-text/20",
} as const;

export type PillColor = keyof typeof colorStyles;

export interface PillProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> {
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
