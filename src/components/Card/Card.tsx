import type React from "react";
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
  interactive = false,
  className,
}: CardProps) {
  const isInteractive = interactive || !!href;

  const containerClass = twMerge(
    "bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--border-radius-lg)] overflow-hidden shadow-sm",
    isInteractive && "transition-shadow hover:shadow-md hover:border-[var(--color-border-focus)] cursor-pointer",
    href && "block focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 outline-none",
    className,
  );

  const content = (
    <>
      {header && (
        <div
          className={twMerge(
            "border-b border-[var(--color-border-default)]",
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
            "border-t border-[var(--color-border-default)]",
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

  return <div className={containerClass}>{content}</div>;
}
