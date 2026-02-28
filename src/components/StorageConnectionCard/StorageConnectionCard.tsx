import type React from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Database, Info } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "../Icon";
import { IconButton } from "../IconButton";
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
  /** Info button handler */
  onInfo?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const statusDotStyles = {
  connected: "bg-[var(--color-status-success)]",
  error: "border-2 border-[var(--color-status-danger)] bg-transparent",
  loading: "bg-[var(--color-status-warning)] animate-pulse",
} as const;

const providerConfig: Record<string, { label: string; color: string }> = {
  aws: { label: "AWS", color: "bg-[var(--color-badge-purple-bg)] text-[var(--color-badge-purple-text)]" },
  azure: { label: "Azure", color: "bg-[var(--color-badge-teal-bg)] text-[var(--color-badge-teal-text)]" },
  gcp: { label: "GCP", color: "bg-[var(--color-badge-slate-bg)] text-[var(--color-badge-slate-text)]" },
  minio: { label: "MinIO", color: "bg-[var(--color-badge-rose-bg)] text-[var(--color-badge-rose-text)]" },
};

export function ProviderBadge({ provider }: { provider: string }) {
  const config = providerConfig[provider.toLowerCase()];
  const label = config?.label ?? provider;
  const colorClass = config?.color ?? "bg-[var(--color-badge-neutral-bg)] text-[var(--color-badge-neutral-text)]";

  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colorClass,
      )}
    >
      {label}
    </span>
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
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[var(--color-surface-danger)] px-4">
        <Icon
          icon={AlertCircle}
          size="lg"
          className="text-[var(--color-text-danger)]"
        />
        {errorMessage && (
          <p className="text-center text-xs text-[var(--color-text-danger)]">{errorMessage}</p>
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
        className="text-[var(--color-text-secondary)]"
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
  onInfo,
  className,
}: StorageConnectionCardProps) {
  const cardContent = (
    <>
      {/* Preview area */}
      <div className="aspect-[4/3] bg-[var(--color-neutral-900)] overflow-hidden rounded-t-[var(--border-radius-lg)]">
        <PreviewArea status={status} errorMessage={errorMessage}>
          {children}
        </PreviewArea>
      </div>

      {/* Info bar */}
      <div className="flex flex-col gap-1.5 border-t border-[var(--color-border-default)] bg-[var(--color-surface-default)] px-3 py-2.5 rounded-b-[var(--border-radius-lg)]">
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
          <span className="min-w-0 flex-1 line-clamp-2 text-sm font-medium text-[var(--color-text-primary)]">
            {name}
          </span>
          {onInfo && (
            <IconButton
              icon={Info}
              aria-label="Connection info"
              variant="ghost"
              size="sm"
              className="shrink-0 -mt-1 -mr-1"
              onPress={() => {
                onInfo();
              }}
            />
          )}
        </div>

        {/* Bottom row: provider badge + region + image count */}
        {(provider || (imageCount != null && (!status || status === "connected"))) && (
          <div className={twMerge("flex items-center gap-2", status && "pl-4")}>
            {provider && <ProviderBadge provider={provider} />}
            {provider && region && (
              <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                {region}
              </span>
            )}
            {imageCount != null && (!status || status === "connected") && (
              <span className="ml-auto shrink-0 text-xs tabular-nums text-[var(--color-text-tertiary)]">
                {imageCount} {imageCount === 1 ? "image" : "images"}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const baseStyles = twMerge(
    "flex flex-col overflow-hidden rounded-[var(--border-radius-lg)]",
    "border border-[var(--color-border-default)]",
    "shadow-sm transition-all",
    href && "hover:border-[var(--color-border-focus)] hover:shadow-md cursor-pointer",
    className,
  );

  if (href) {
    return (
      <a href={href} className={twMerge(baseStyles, "no-underline")}>
        {cardContent}
      </a>
    );
  }

  return <div className={baseStyles}>{cardContent}</div>;
}
