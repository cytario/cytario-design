import type React from "react";
import { useCallback } from "react";
import { File, Info, type LucideIcon } from "lucide-react";
import { IconButton } from "../IconButton";

/* ------------------------------------------------------------------ */
/*  FileCard                                                            */
/* ------------------------------------------------------------------ */

export interface FileCardProps {
  /** File or folder name */
  name: string;
  /** Icon to display in thumbnail fallback and metadata row */
  icon?: LucideIcon;
  /** Human-readable file size (e.g., "12.3 GB") */
  size?: string;
  /** Compact mode (smaller card, square aspect, minimal metadata) */
  compact?: boolean;
  /** Custom thumbnail content (e.g., an image preview) */
  children?: React.ReactNode;
  /** Info button handler */
  onInfo?: () => void;
  /** Handler for click/press interaction */
  onPress?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function FileCard({
  name,
  icon: IconComponent = File,
  size,
  compact = false,
  children,
  onInfo,
  onPress,
  className,
}: FileCardProps) {
  const isInteractive = !!onPress;

  const radius = compact
    ? "rounded-md"
    : "rounded-lg";

  const iconSize = compact ? 24 : 32;

  const thumbnailClass = compact
    ? "aspect-square rounded-t-(--border-radius-md)"
    : "aspect-[4/3] rounded-t-(--border-radius-lg)";

  const handleInfoClick = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if (isInteractive) {
        e.stopPropagation();
        e.preventDefault();
      }
      onInfo?.();
    },
    [onInfo, isInteractive],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (onPress && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onPress();
      }
    },
    [onPress],
  );

  const cardContent = (
    <>
      {/* Thumbnail area */}
      <div
        className={`shrink-0 overflow-hidden bg-neutral-900 ${thumbnailClass}`}
      >
        {children ? (
          <div className="h-full w-full overflow-hidden">{children}</div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconComponent size={iconSize} className="text-(--color-text-secondary)" />
          </div>
        )}
      </div>

      {/* Metadata area */}
      <div
        className={[
          "flex flex-col border-t border-(--color-border-default)",
          "bg-(--color-surface-default)",
          compact
            ? "px-2 py-1.5 rounded-b-(--border-radius-md)"
            : "gap-0.5 px-3 py-2 rounded-b-(--border-radius-lg)",
        ].join(" ")}
      >
        {compact ? (
          <span className="text-xs font-medium text-(--color-text-primary) truncate">
            {name}
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <IconComponent
                size={16}
                className="shrink-0 text-(--color-text-secondary)"
              />
              <span className="min-w-0 flex-1 text-sm font-medium text-(--color-text-primary) truncate">
                {name}
              </span>
              {onInfo && (
                <span
                  onClick={handleInfoClick}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleInfoClick(e);
                    }
                  }}
                  role="presentation"
                >
                  <IconButton
                    icon={Info}
                    aria-label={`Show info for ${name}`}
                    variant="ghost"
                    size="sm"
                    className="shrink-0 -mt-0.5 -mr-1"
                    onPress={onInfo}
                  />
                </span>
              )}
            </span>
            {size && (
              <span className="text-xs text-(--color-text-secondary) tabular-nums pl-[22px]">
                {size}
              </span>
            )}
          </>
        )}
      </div>
    </>
  );

  const baseStyles = [
    "group flex flex-col overflow-hidden",
    radius,
    "border border-(--color-border-default)",
    "shadow-sm",
    "transition-all",
    isInteractive &&
      "hover:border-(--color-border-focus) hover:shadow-md cursor-pointer",
    isInteractive &&
      "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 outline-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onPress) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={name}
        className={baseStyles}
        onClick={onPress}
        onKeyDown={handleKeyDown}
      >
        {cardContent}
      </div>
    );
  }

  return <div className={baseStyles}>{cardContent}</div>;
}
