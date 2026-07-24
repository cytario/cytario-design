import type React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  /** Card body content */
  children: React.ReactNode;
  /** Optional header content (rendered with bottom border separator) */
  header?: React.ReactNode;
  /** Optional footer content (rendered with top border separator) */
  footer?: React.ReactNode;
  /** Merge override */
  className?: string;
}

export function Card({ children, header, footer, className }: CardProps) {
  const cx = twMerge(
    `
      bg-card p-8
      border border-border
      rounded-lg
      shadow-sm
    `,
    className,
  );
  return (
    <div className={cx}>
      {header && <div className="border-b border-border">{header}</div>}
      {children}
      {footer && <div className="border-t border-border">{footer}</div>}
    </div>
  );
}
