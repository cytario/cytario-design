import type React from "react";
import { useCallback } from "react";
import {
  File,
  FileSpreadsheet,
  Folder,
  Image,
  Info,
  Microscope,
  type LucideIcon,
} from "lucide-react";
import { IconButton } from "../IconButton";

/* ------------------------------------------------------------------ */
/*  File type helpers                                                   */
/* ------------------------------------------------------------------ */

export function getFileIcon(
  type: "directory" | "file",
  extension?: string,
): LucideIcon {
  if (type === "directory") return Folder;
  const ext = (extension ?? "").toLowerCase();
  if (ext === "ome.tif" || ext === "ome.tiff") return Microscope;
  if (/^(tiff?|png|jpe?g)$/.test(ext)) return Image;
  if (/^(csv|parquet)$/.test(ext)) return FileSpreadsheet;
  return File;
}

export function getTypeLabel(
  type: "directory" | "file",
  extension?: string,
): string {
  if (type === "directory") return "Folder";
  const ext = (extension ?? "").toLowerCase();
  if (ext === "ome.tif" || ext === "ome.tiff") return "OME-TIFF";
  if (/^tiff?$/.test(ext)) return "TIFF";
  if (ext === "csv") return "CSV";
  if (ext === "parquet") return "Parquet";
  if (ext === "png") return "PNG";
  if (/^jpe?g$/.test(ext)) return "JPEG";
  return ext.toUpperCase() || "File";
}

export function FileIcon({
  type,
  extension,
  size = 16,
}: {
  type: "directory" | "file";
  extension?: string;
  size?: number;
}) {
  const IconComponent = getFileIcon(type, extension);
  return (
    <IconComponent
      size={size}
      className="shrink-0 text-[var(--color-text-secondary)]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  FileCard                                                            */
/* ------------------------------------------------------------------ */

export interface FileCardProps {
  /** File or folder name */
  name: string;
  /** Whether this is a directory or file */
  type: "directory" | "file";
  /** Human-readable file size (e.g., "12.3 GB") */
  size?: string;
  /** Last modified date/time */
  modified?: string;
  /** File extension (e.g., "ome.tif", "csv") */
  extension?: string;
  /** Whether a thumbnail preview is available */
  hasPreview?: boolean;
  /** Compact mode (smaller card, square aspect, minimal metadata) */
  compact?: boolean;
  /** Custom thumbnail content (e.g., an image preview) */
  children?: React.ReactNode;
  /** Info button handler */
  onInfo?: () => void;
  /** Navigation target — clicking the card navigates here */
  href?: string;
  /** Handler for click/press interaction (use instead of href for programmatic navigation) */
  onPress?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function FileCard({
  name,
  type,
  size,
  extension,
  compact = false,
  children,
  onInfo,
  href,
  onPress,
  className,
}: FileCardProps) {
  const isInteractive = !!href || !!onPress;

  const radius = compact
    ? "rounded-[var(--border-radius-md)]"
    : "rounded-[var(--border-radius-lg)]";

  const IconComponent = getFileIcon(type, extension);
  const iconSize = compact ? 24 : 32;
  const iconColor =
    type === "directory"
      ? "text-[var(--color-text-tertiary)]"
      : "text-[var(--color-text-secondary)]";

  const thumbnailClass = compact
    ? "aspect-square rounded-t-[var(--border-radius-md)]"
    : "aspect-[4/3] rounded-t-[var(--border-radius-lg)]";

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
        className={`shrink-0 overflow-hidden bg-[var(--color-neutral-900)] ${thumbnailClass}`}
      >
        {children ? (
          <div className="h-full w-full overflow-hidden">{children}</div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IconComponent size={iconSize} className={iconColor} />
          </div>
        )}
      </div>

      {/* Metadata area */}
      <div
        className={[
          "flex flex-col border-t border-[var(--color-border-default)]",
          "bg-[var(--color-surface-default)]",
          compact
            ? "px-2 py-1.5 rounded-b-[var(--border-radius-md)]"
            : "gap-0.5 px-3 py-2 rounded-b-[var(--border-radius-lg)]",
        ].join(" ")}
      >
        {compact ? (
          <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">
            {name}
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <FileIcon type={type} extension={extension} size={16} />
              <span className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-primary)] truncate">
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
              <span className="text-xs text-[var(--color-text-secondary)] tabular-nums pl-[22px]">
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
    "border border-[var(--color-border-default)]",
    "shadow-sm",
    "transition-all",
    isInteractive &&
      "hover:border-[var(--color-border-focus)] hover:shadow-md cursor-pointer",
    isInteractive &&
      "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 outline-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a
        href={href}
        aria-label={name}
        className={[baseStyles, "no-underline"].join(" ")}
      >
        {cardContent}
      </a>
    );
  }

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
