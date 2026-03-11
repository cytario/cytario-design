import type React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type DeltaFormat = "currency" | "percentage" | "combined";
export type DeltaMode = "inline" | "pill";

export interface DeltaIndicatorProps {
  /** Current period value */
  current: number;
  /** Comparison period value */
  previous: number;
  /** Display format */
  format?: DeltaFormat;
  /** Display mode: inline (no background) or pill (tinted background) */
  mode?: DeltaMode;
  /** Optional prefix label (e.g., "MoM", "YoY") */
  label?: string;
  /** When true, increase = green, decrease = red (for metrics where higher is better) */
  reverseColor?: boolean;
  /** Renders "N/A" in muted text */
  unavailable?: boolean;
  /** Custom unavailable text */
  unavailableText?: string;
  /** Merge override */
  className?: string;
}

type Direction = "increase" | "decrease" | "flat";

function getDirection(current: number, previous: number): Direction {
  const diff = current - previous;
  if (diff > 0) return "increase";
  if (diff < 0) return "decrease";
  return "flat";
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value >= 0 ? "+" : "-";
  if (abs < 1000) {
    return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${sign}$${abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPercentage(current: number, previous: number): string | null {
  if (previous === 0) return null;
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

const directionColors: Record<Direction, string> = {
  increase: "text-(--color-delta-increase-text)",
  decrease: "text-(--color-delta-decrease-text)",
  flat: "text-(--color-delta-flat-text)",
};

const reverseDirectionColors: Record<Direction, string> = {
  increase: "text-(--color-delta-decrease-text)",
  decrease: "text-(--color-delta-increase-text)",
  flat: "text-(--color-delta-flat-text)",
};

const directionIcons: Record<Direction, React.ComponentType<{ size: number; "aria-hidden": boolean }>> = {
  increase: ArrowUp,
  decrease: ArrowDown,
  flat: Minus,
};

const directionBgColors: Record<Direction, string> = {
  increase: "bg-(--color-delta-increase-bg)",
  decrease: "bg-(--color-delta-decrease-bg)",
  flat: "bg-(--color-delta-flat-bg)",
};

export function DeltaIndicator({
  current,
  previous,
  format = "combined",
  mode = "inline",
  label,
  reverseColor = false,
  unavailable = false,
  unavailableText = "N/A",
  className,
}: DeltaIndicatorProps) {
  if (unavailable) {
    return (
      <span
        className={twMerge(
          "inline-flex items-center gap-1 font-medium",
          "text-(--color-text-tertiary)",
          className,
        )}
      >
        {label && (
          <span className="text-sm text-(--color-text-secondary) mr-1">
            {label}
          </span>
        )}
        {unavailableText}
      </span>
    );
  }

  const diff = current - previous;
  const direction = getDirection(current, previous);
  const colorStyles = reverseColor
    ? reverseDirectionColors[direction]
    : directionColors[direction];
  const IconComponent = directionIcons[direction];

  const isNew = previous === 0 && current > 0;

  let valueText: string;
  if (format === "currency") {
    valueText = formatCurrency(diff);
    if (isNew) valueText = `${formatCurrency(diff)} (new)`;
  } else if (format === "percentage") {
    const pct = formatPercentage(current, previous);
    valueText = pct ?? formatCurrency(diff);
    if (isNew) valueText = "New";
  } else {
    // combined
    const pct = formatPercentage(current, previous);
    if (isNew) {
      valueText = `${formatCurrency(diff)} (new)`;
    } else if (pct) {
      valueText = `${formatCurrency(diff)} (${pct})`;
    } else {
      valueText = formatCurrency(diff);
    }
  }

  const isPill = mode === "pill";

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 font-medium",
        colorStyles,
        isPill && [
          "rounded-full px-2 py-0.5",
          "text-xs",
          directionBgColors[direction],
        ],
        className,
      )}
    >
      {label && (
        <span className="text-sm text-(--color-text-secondary) mr-1">
          {label}
        </span>
      )}
      <IconComponent size={14} aria-hidden={true} />
      {valueText}
    </span>
  );
}
