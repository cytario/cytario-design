import type React from "react";
import { useCallback } from "react";
import { AlertCircle, Database } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Icon } from "../Icon";
import { Spinner } from "../Spinner";

export interface StorageConnectionCardProps {
  name: string;
  status?: "connected" | "error" | "loading";
  errorMessage?: string;
  /** Metadata row below the name (e.g. provider pill, scope pill, region text) */
  meta?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  onPress?: () => void;
  /** Slot for action controls (e.g. a dropdown menu) rendered in the card header */
  actions?: React.ReactNode;
  className?: string;
}

export const statusDotStyles = {
  connected: "bg-(--color-status-success)",
  error: "border-2 border-(--color-status-danger) bg-transparent",
  loading: "bg-(--color-status-warning) animate-pulse",
} as const;

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
  status,
  errorMessage,
  meta,
  children,
  href,
  onPress,
  actions,
  className,
}: StorageConnectionCardProps) {
  const isInteractive = !!href || !!onPress;

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
      <div className="aspect-[4/3] bg-neutral-900 overflow-hidden rounded-t-(--border-radius-lg)">
        <PreviewArea status={status} errorMessage={errorMessage}>
          {children}
        </PreviewArea>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-(--color-border-default) bg-(--color-surface-default) px-3 py-2.5 rounded-b-(--border-radius-lg)">
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
          {actions && (
            <span
              onClick={(e) => { if (isInteractive) { e.stopPropagation(); e.preventDefault(); } }}
              onKeyDown={(e) => { if (isInteractive) { e.stopPropagation(); } }}
              role="presentation"
              className="shrink-0 -mt-1 -mr-1"
            >
              {actions}
            </span>
          )}
        </div>

        {meta && (
          <div className={twMerge("flex items-center gap-2", status && "pl-4")}>
            {meta}
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
