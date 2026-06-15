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
      "bg-info-surface border-info-border text-info-surface-foreground",
    iconClass: "text-info",
    role: "status",
  },
  warning: {
    icon: AlertTriangle,
    containerClass:
      "bg-warning-surface border-warning-border text-warning-surface-foreground",
    iconClass: "text-warning",
    role: "alert",
  },
  danger: {
    icon: AlertCircle,
    containerClass:
      "bg-destructive-surface border-destructive-border text-destructive-surface-foreground",
    iconClass: "text-destructive",
    role: "alert",
  },
  success: {
    icon: CheckCircle2,
    containerClass:
      "bg-success-surface border-success-border text-success-surface-foreground",
    iconClass: "text-success",
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
        "flex items-start gap-3 rounded-lg border px-4 py-3",
        "text-sm",
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
          <span className="font-medium">
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
          className="shrink-0 rounded-sm p-0.5 opacity-70 hover:opacity-100 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
