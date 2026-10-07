import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type GridColumns = 1 | 2 | 3 | 4;
export type GridGap = 1 | 2 | 3 | 4 | 6;

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Column count at the responsive step (and up). Default 1. */
  columns?: GridColumns;
  /** Viewport step at which `columns` applies. Default "sm" (≥640px). */
  columnsAt?: "sm";
  /** Gap on both axes. Default 4. */
  gap?: GridGap;
  /** Horizontal gap override. Default = gap. */
  gapX?: GridGap;
  /** Vertical gap override. Default = gap. */
  gapY?: GridGap;
  /** Merge override */
  className?: string;
}

// Static maps keep every shipped utility class in this file so the
// Tailwind scanner emits them into the library CSS. The base is always a
// single column (mobile-first); grid-cols-2..4 stay in the vocabulary so
// consumers can set their own base via className.
const columnBaseClasses: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

// Keyed by breakpoint prefix so adding a step is a one-entry change.
const columnStepClasses: Record<
  NonNullable<GridProps["columnsAt"]>,
  Record<Exclude<GridColumns, 1>, string>
> = {
  sm: {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  },
};

const gapXClasses: Record<GridGap, string> = {
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  6: "gap-x-6",
};

const gapYClasses: Record<GridGap, string> = {
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  6: "gap-y-6",
};

/**
 * Responsive two-dimensional layout primitive.
 *
 * Mobile-first: the grid is always a single column below the `columnsAt`
 * step, then switches to `columns` columns at `sm` and up. Pass `gapX` /
 * `gapY` to override one axis of `gap`.
 *
 * @example
 * <Grid columns={2} gapX={6} gapY={3}>…</Grid>
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  {
    children,
    columns = 1,
    columnsAt = "sm",
    gap = 4,
    gapX,
    gapY,
    className,
    ...rest
  },
  ref,
) {
  const cx = twMerge(
    "grid",
    columnBaseClasses[1],
    columns > 1
      ? columnStepClasses[columnsAt][columns as Exclude<GridColumns, 1>]
      : null,
    gapXClasses[gapX ?? gap],
    gapYClasses[gapY ?? gap],
    className,
  );
  return (
    <div ref={ref} className={cx} {...rest}>
      {children}
    </div>
  );
});
