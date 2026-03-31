import type React from "react";
import { useCallback } from "react";
import { AlertCircle, Database, Info } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
import type { PillColor } from "../Pill";
import { Pill } from "../Pill";
import { Spinner } from "../Spinner";

export interface StorageConnectionCardProps {
  /** Display name for the connection */
  name: string;
  /** Cloud provider identifier (e.g., "aws", "minio", "azure", "gcp"). When omitted, the provider badge and region are hidden. */
  provider?: string;
  /** AWS region or equivalent (only rendered when provider is set) */
  region?: string;
  /** Connection health status. When omitted, the status dot is hidden and the preview area behaves as "connected". */
  status?: "connected" | "error" | "loading";
  /** Human-readable error message when status is "error" */
  errorMessage?: string;
  /** Number of viewable images in the bucket */
  imageCount?: number;
  /** Children rendered in the preview area (e.g., an actual tile viewer, or an img) */
  children?: React.ReactNode;
  /** Navigation target — clicking the card navigates here */
  href?: string;
  /** Handler for click/press interaction (use instead of href for programmatic navigation) */
  onPress?: () => void;
  /** Info button handler */
  onInfo?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const statusDotStyles = {
  connected: "bg-(--color-status-success)",
  error: "border-2 border-(--color-status-danger) bg-transparent",
  loading: "bg-(--color-status-warning) animate-pulse",
} as const;

const providerConfig: Record<string, { label: string; color: PillColor }> = {
  aws: { label: "AWS", color: "purple" },
  azure: { label: "Azure", color: "teal" },
  gcp: { label: "GCP", color: "green" },
  minio: { label: "MinIO", color: "rose" },
};

export function ProviderBadge({ provider }: { provider: string }) {
  const config = providerConfig[provider.toLowerCase()];
  const label = config?.label ?? provider;
  const color: PillColor | undefined = config?.color;

  return (
    <Pill color={color}>
      {label}
    </Pill>
  );
}

function PreviewArea({
  status = "connected",
  errorMessage,
  children,
}: Pick<StorageConnectionCardProps, "status" | "errorMessage" | "children">) {
  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" aria-label="Loading connection" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-(--color-surface-danger) px-4">
        <Icon
          icon={AlertCircle}
          size="lg"
          className="text-(--color-text-danger)"
        />
        {errorMessage && (
          <p className="text-center text-xs text-(--color-text-danger)">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (children) {
    return <div className="h-full w-full overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Icon
        icon={Database}
        size="xl"
        className="text-(--color-text-secondary)"
      />
    </div>
  );
}

export function StorageConnectionCard({
  name,
  provider,
  region,
  status,
  errorMessage,
  imageCount,
  children,
  href,
  onPress,
  onInfo,
  className,
}: StorageConnectionCardProps) {
  const isInteractive = !!href || !!onPress;

  const handleInfoPress = useCallback(
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
      {/* Preview area */}
      <div className="aspect-[4/3] bg-neutral-900 overflow-hidden rounded-t-(--border-radius-lg)">
        <PreviewArea status={status} errorMessage={errorMessage}>
          {children}
        </PreviewArea>
      </div>

      {/* Info bar */}
      <div className="flex flex-col gap-1.5 border-t border-(--color-border-default) bg-(--color-surface-default) px-3 py-2.5 rounded-b-(--border-radius-lg)">
        {/* Top row: status dot + name + info button */}
        <div className="flex items-start gap-2">
          {status && (
            <span
              className={twMerge(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                statusDotStyles[status],
              )}
              aria-label={`Status: ${status}`}
            />
          )}
          <span className="min-w-0 flex-1 line-clamp-2 text-sm font-medium text-(--color-text-primary)">
            {name}
          </span>
          {onInfo && (
            <span
              onClick={handleInfoPress}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleInfoPress(e);
                }
              }}
              role="presentation"
            >
              <IconButton
                icon={Info}
                aria-label="Connection info"
                variant="ghost"
                size="sm"
                className="shrink-0 -mt-1 -mr-1"
                onPress={onInfo}
              />
            </span>
          )}
        </div>

        {/* Bottom row: provider badge + region + image count */}
        {(provider || (imageCount != null && (!status || status === "connected"))) && (
          <div className={twMerge("flex items-center gap-2", status && "pl-4")}>
            {provider && <ProviderBadge provider={provider} />}
            {provider && region && (
              <span className="shrink-0 text-xs text-(--color-text-secondary)">
                {region}
              </span>
            )}
            {imageCount != null && (!status || status === "connected") && (
              <span className="ml-auto shrink-0 text-xs tabular-nums text-(--color-text-secondary)">
                {imageCount} {imageCount === 1 ? "image" : "images"}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const baseStyles = twMerge(
    "flex flex-col overflow-hidden rounded-lg",
    "border border-(--color-border-default)",
    "shadow-sm transition-all",
    isInteractive && "hover:border-(--color-border-focus) hover:shadow-md cursor-pointer",
    isInteractive && "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 outline-none",
    className,
  );

  if (href) {
    return (
      <a href={href} className={twMerge(baseStyles, "no-underline")}>
        {cardContent}
      </a>
    );
  }

  if (onPress) {
    return (
      <div
        role="button"
        tabIndex={0}
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
