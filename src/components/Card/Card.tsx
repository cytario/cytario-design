import type React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps {
  /** Card body content */
  children: React.ReactNode;
  /** Optional header content (rendered with bottom border separator) */
  header?: React.ReactNode;
  /** Optional footer content (rendered with top border separator) */
  footer?: React.ReactNode;
  /** Adds a slowly rotating brand-glow halo around the edge (conic-gradient
   * ring, CSS-only; dark surfaces are where it reads best) */
  glow?: boolean;
  /** Merge override */
  className?: string;
}

export function Card({ children, header, footer, glow = false, className }: CardProps) {
  const cx = twMerge(
    `
      bg-card p-8
      border border-border
      rounded-lg
      shadow-sm
    `,
    glow && "glow-edge",
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
