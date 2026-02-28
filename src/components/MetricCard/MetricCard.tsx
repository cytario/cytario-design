import type React from "react";
import { twMerge } from "tailwind-merge";

export type MetricCardSize = "sm" | "md";

export interface MetricCardProps {
  /** Metric label (e.g., "Total Spend") */
  label: React.ReactNode;
  /** Primary value (formatted string or component) */
  value: React.ReactNode;
  /** Secondary content rendered below the value */
  secondary?: React.ReactNode;
  /** Makes the entire card a clickable link */
  href?: string;
  /** Size preset */
  size?: MetricCardSize;
  /** Merge override */
  className?: string;
}

const sizeConfig: Record<
  MetricCardSize,
  { padding: string; labelClass: string; valueClass: string }
> = {
  sm: {
    padding: "p-3",
    labelClass: "text-[length:var(--font-size-xs)]",
    valueClass: "text-[length:var(--font-size-xl)]",
  },
  md: {
    padding: "p-4",
    labelClass: "text-[length:var(--font-size-sm)]",
    valueClass: "text-[length:var(--font-size-2xl)]",
  },
};

export function MetricCard({
  label,
  value,
  secondary,
  href,
  size = "md",
  className,
}: MetricCardProps) {
  const config = sizeConfig[size];

  const containerClass = twMerge(
    "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--border-radius-lg)] shadow-sm",
    config.padding,
    href &&
      "block transition-shadow hover:shadow-md hover:border-[var(--color-border-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 outline-none",
    className,
  );

  const content = (
    <>
      <div className={twMerge(config.labelClass, "text-[var(--color-text-secondary)]")}>
        {label}
      </div>
      <div
        className={twMerge(
          config.valueClass,
          "font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] mt-1 tabular-nums",
        )}
      >
        {value}
      </div>
      {secondary && <div className="mt-1 text-sm">{secondary}</div>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={containerClass}>
        {content}
      </a>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
