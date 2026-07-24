import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type DescriptionSize = "sm" | "md" | "lg" | "xl";

export interface DescriptionProps extends Omit<
  HTMLAttributes<HTMLParagraphElement>,
  "children"
> {
  /** Content rendered inside the paragraph */
  children: ReactNode;
  /** Visual size variant (default "md") */
  size?: DescriptionSize;
  /** Merge override */
  className?: string;
}

const sizeClasses: Record<DescriptionSize, string> = {
  sm: "text-sm md:text-base",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
};

/**
 * Renders a single paragraph of muted body copy with responsive sizing.
 *
 * Use for lead text, supporting descriptions, and other non-heading prose.
 * The element is a `<p>` so it participates in normal document flow. Pass
 * `size` to scale the text; pass `className` to override colour, margin, or
 * any other utility.
 *
 * @example
 * <Description size="lg">Supporting copy beneath a heading.</Description>
 */
export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(
  function Description({ size = "md", className, children, ...rest }, ref) {
    return (
      <p
        ref={ref}
        className={twMerge(
          "text-pretty text-muted-foreground mb-4",
          sizeClasses[size],
          className,
        )}
        {...rest}
      >
        {children}
      </p>
    );
  },
);
