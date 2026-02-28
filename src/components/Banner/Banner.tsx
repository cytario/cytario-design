import { useState, type ReactNode } from "react";
import {
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type BannerVariant = "info" | "warning" | "danger" | "success";

export interface BannerProps {
  /** Banner content */
  children: ReactNode;
  /** Visual variant */
  variant?: BannerVariant;
  /** Bold lead text */
  title?: string;
  /** Leading icon (auto-selected per variant if not set) */
  icon?: LucideIcon;
  /** Shows dismiss button */
  dismissible?: boolean;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Merge override */
  className?: string;
}

const variantConfig: Record<
  BannerVariant,
  { icon: LucideIcon; containerClass: string; iconClass: string; role: string }
> = {
  info: {
    icon: Info,
    containerClass:
      "bg-[var(--color-banner-info-bg)] border-[var(--color-banner-info-border)] text-[var(--color-banner-info-text)]",
    iconClass: "text-[var(--color-banner-info-icon)]",
    role: "status",
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "bg-[var(--color-banner-warning-bg)] border-[var(--color-banner-warning-border)] text-[var(--color-banner-warning-text)]",
    iconClass: "text-[var(--color-banner-warning-icon)]",
    role: "alert",
  },
  danger: {
    icon: AlertCircle,
    containerClass:
      "bg-[var(--color-banner-danger-bg)] border-[var(--color-banner-danger-border)] text-[var(--color-banner-danger-text)]",
    iconClass: "text-[var(--color-banner-danger-icon)]",
    role: "alert",
  },
  success: {
    icon: CheckCircle2,
    containerClass:
      "bg-[var(--color-banner-success-bg)] border-[var(--color-banner-success-border)] text-[var(--color-banner-success-text)]",
    iconClass: "text-[var(--color-banner-success-icon)]",
    role: "status",
  },
};

export function Banner({
  children,
  variant = "info",
  title,
  icon,
  dismissible = false,
  onDismiss,
  className,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const config = variantConfig[variant];
  const IconComponent = icon ?? config.icon;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role={config.role}
      className={twMerge(
        "flex items-start gap-[var(--spacing-3)] rounded-[var(--border-radius-lg)] border px-[var(--spacing-4)] py-[var(--spacing-3)]",
        "text-[length:var(--font-size-sm)]",
        config.containerClass,
        className,
      )}
    >
      <IconComponent
        size={20}
        className={twMerge("shrink-0 mt-0.5", config.iconClass)}
        aria-hidden="true"
      />
      <div className="flex-1">
        {title && (
          <span className="font-[number:var(--font-weight-medium)]">
            {title}
            {" \u2014 "}
          </span>
        )}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-[var(--border-radius-sm)] p-0.5 opacity-70 hover:opacity-100 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
