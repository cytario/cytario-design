import type React from "react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { Heading } from "../Heading";
import type { HeadingLevel } from "../Heading";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Section title rendered as a heading (default H2) */
  title: string;
  /** Heading level for the title (default "h2") */
  as?: HeadingLevel;
  /** Optional action elements (buttons, badges, etc.) rendered on the right */
  children?: React.ReactNode;
  /** Additional CSS classes applied to the outer container */
  className?: string;
}

/**
 * Section header with a title on the left and optional action slots on the right.
 *
 * Mirrors the `SectionHeader` pattern from cytario-web's `Container.tsx`.
 * The title renders as a heading (default `<H2>`); any `children` are
 * placed in a flex container that aligns to the trailing edge.
 */
export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  function SectionHeader(
    { title, as = "h2", children, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={twMerge(
          "flex flex-wrap items-center gap-3 pt-0 pb-4",
          className,
        )}
        {...rest}
      >
        <Heading as={as}>{title}</Heading>
        {children && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {children}
          </div>
        )}
      </div>
    );
  },
);
