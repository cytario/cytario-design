import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  type CellProps as AriaCellProps,
  type ColumnProps as AriaColumnProps,
  type RowProps as AriaRowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps as AriaTableProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export type TableSize = "compact" | "comfortable";

/* ------------------------------------------------------------------ */
/*  Table                                                              */
/* ------------------------------------------------------------------ */

export interface DataTableProps
  extends Omit<AriaTableProps, "className"> {
  /** Row density */
  size?: TableSize;
  /** Additional classes merged into the base styles via twMerge. */
  className?: string;
}

const tableSizeClass: Record<TableSize, string> = {
  compact: "[--table-row-py:theme(spacing.1)]",
  comfortable: "[--table-row-py:theme(spacing.3)]",
};

export function Table({
  size = "comfortable",
  className,
  ...props
}: DataTableProps) {
  return (
    <AriaTable
      {...props}
      className={twMerge(
        "w-full border-collapse text-sm text-foreground",
        tableSizeClass[size],
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TableHeader                                                        */
/* ------------------------------------------------------------------ */

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
  return <AriaTableHeader {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Column                                                             */
/* ------------------------------------------------------------------ */

export interface ColumnProps extends Omit<AriaColumnProps, "className"> {
  /** Additional classes merged into the base styles via twMerge. */
  className?: string;
}

export function Column({ className, ...props }: ColumnProps) {
  return (
    <AriaColumn
      {...props}
      className={twMerge(
        "px-3 py-2 text-left font-semibold text-muted-foreground",
        "border-b-2 border-border",
        "cursor-default select-none outline-none",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
        className,
      )}
    >
      {({ allowsSorting, sortDirection }) => (
        <span className="inline-flex items-center gap-1">
          {props.children as React.ReactNode}
          {allowsSorting && (
            <span aria-hidden="true" className="text-muted-foreground">
              {sortDirection === "ascending"
                ? "\u25B2"
                : sortDirection === "descending"
                  ? "\u25BC"
                  : "\u25B4"}
            </span>
          )}
        </span>
      )}
    </AriaColumn>
  );
}

/* ------------------------------------------------------------------ */
/*  TableBody                                                          */
/* ------------------------------------------------------------------ */

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Row                                                                */
/* ------------------------------------------------------------------ */

export interface RowProps<T extends object>
  extends Omit<AriaRowProps<T>, "className"> {
  /** Additional classes merged into the base styles via twMerge. */
  className?: string;
}

export function Row<T extends object>({
  className,
  ...props
}: RowProps<T>) {
  return (
    <AriaRow
      {...props}
      className={twMerge(
        "border-b border-border",
        "even:bg-card",
        "hover:bg-muted",
        "data-[selected]:bg-accent",
        "data-[selected]:ring-2 data-[selected]:ring-ring data-[selected]:ring-inset",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
        "transition-colors",
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Cell                                                               */
/* ------------------------------------------------------------------ */

export interface CellProps extends Omit<AriaCellProps, "className"> {
  /** Additional classes merged into the base styles via twMerge. */
  className?: string;
}

export function Cell({ className, ...props }: CellProps) {
  return (
    <AriaCell
      {...props}
      className={twMerge(
        "px-3 py-(--table-row-py)",
        "text-foreground",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]",
        className,
      )}
    />
  );
}
