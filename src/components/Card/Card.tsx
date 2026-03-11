import type React from "react";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps {
  /** Card body content */
  children: React.ReactNode;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content (rendered with top border separator) */
  footer?: React.ReactNode;
  /** Body padding preset */
  padding?: CardPadding;
  /** Makes the card a clickable link */
  href?: string;
  /** Handler for click/press interaction (use instead of href for programmatic navigation) */
  onPress?: () => void;
  /** Enables hover elevation even without href */
  interactive?: boolean;
  /** Merge override */
  className?: string;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  header,
  footer,
  padding = "md",
  href,
  onPress,
  interactive = false,
  className,
}: CardProps) {
  const isInteractive = interactive || !!href || !!onPress;

  const containerClass = twMerge(
    "bg-(--color-surface-default) border border-(--color-border-default) rounded-lg overflow-hidden shadow-sm",
    isInteractive && "transition-all hover:shadow-md hover:border-(--color-border-focus) cursor-pointer",
    (href || onPress) && "block focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 outline-none",
    className,
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

  const content = (
    <>
      {header && (
        <div
          className={twMerge(
            "border-b border-(--color-border-default)",
            paddingStyles[padding],
          )}
        >
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
      {footer && (
        <div
          className={twMerge(
            "border-t border-(--color-border-default)",
            paddingStyles[padding],
          )}
        >
          {footer}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={containerClass}>
        {content}
      </a>
    );
  }

  if (onPress) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={containerClass}
        onClick={onPress}
        onKeyDown={handleKeyDown}
      >
        {content}
      </div>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
