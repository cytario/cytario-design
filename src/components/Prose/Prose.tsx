import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the `.prose` container */
  children: ReactNode;
  /** Visual size variant (default "default") */
  size?: "sm" | "default" | "lg" | "xl";
  /** Invert colours for dark backgrounds (default false) */
  invert?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<ProseProps["size"]>, string> = {
  sm: "prose-sm",
  default: "prose",
  lg: "prose-lg",
  xl: "prose-xl",
};

/**
 * Renders rich-text / long-form content with the Tailwind Typography plugin.
 *
 * Wrap markdown output, static documentation, or any long-form content that
 * contains `<h1>`–`<h6>`, `<p>`, `<ul>`, `<ol>`, `<blockquote>`, `<code>` and
 * similar elements. The wrapper applies the `prose` class family so the
 * content inherits consistent typographic spacing and colour.
 *
 * @example
 * <Prose size="lg">{renderMarkdown(content)}</Prose>
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { size = "default", invert = false, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        "prose",
        sizeClasses[size],
        invert && "prose-invert",
        "max-w-none",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
