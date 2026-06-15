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
    labelClass: "text-xs",
    valueClass: "text-xl",
  },
  md: {
    padding: "p-4",
    labelClass: "text-sm",
    valueClass: "text-2xl",
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
    "bg-background border border-border rounded-lg shadow-sm",
    config.padding,
    href &&
      "block transition-shadow hover:shadow-md hover:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
    className,
  );

  const content = (
    <>
      <div className={twMerge(config.labelClass, "text-muted-foreground")}>
        {label}
      </div>
      <div
        className={twMerge(
          config.valueClass,
          "font-semibold text-foreground mt-1 tabular-nums",
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
