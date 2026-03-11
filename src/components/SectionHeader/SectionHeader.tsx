import type React from "react";
import { twMerge } from "tailwind-merge";
import { H2 } from "../Heading";

export interface SectionHeaderProps {
  /** Section title rendered as an H2 heading */
  title: string;
  /** Optional action elements (buttons, badges, etc.) rendered on the right */
  children?: React.ReactNode;
  /** Additional CSS classes applied to the outer container */
  className?: string;
}

/**
 * Section header with a title on the left and optional action slots on the right.
 *
 * Mirrors the `SectionHeader` pattern from cytario-web's `Container.tsx`.
 * The title renders as an `<H2>` heading; any `children` are placed in a
 * flex container that aligns to the trailing edge.
 */
export function SectionHeader({
  title,
  children,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex flex-wrap items-center gap-3 py-4",
        className,
      )}
    >
      <H2>{title}</H2>
      {children && (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
