import { twMerge } from "tailwind-merge";

export type ProgressBarVariant =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type ProgressBarSize = "sm" | "md" | "lg";

export interface ProgressBarProps {
  /** Percentage value (0-100) */
  value: number;
  /** Label text above the bar */
  label?: string;
  /** Description text (right-aligned, above bar) */
  description?: string;
  /** Fill color variant */
  variant?: ProgressBarVariant;
  /** Bar height */
  size?: ProgressBarSize;
  /** Show percentage text */
  showValue?: boolean;
  /** Merge override */
  className?: string;
}

const fillStyles: Record<ProgressBarVariant, string> = {
  brand: "bg-progress-fill",
  success: "bg-progress-fill-success",
  warning: "bg-progress-fill-warning",
  danger: "bg-progress-fill-danger",
  neutral: "bg-muted-foreground",
};

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  description,
  variant = "brand",
  size = "md",
  showValue = true,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={twMerge("w-full", className)}>
      {(label || description || showValue) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          <span className="text-sm text-muted-foreground">
            {description ?? (showValue ? `${clampedValue}%` : null)}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className={twMerge(
          "w-full rounded-full bg-progress-track",
          sizeStyles[size],
        )}
      >
        <div
          className={twMerge(
            "h-full rounded-full transition-all duration-300",
            fillStyles[variant],
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
