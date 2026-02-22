import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  type CellProps,
  type ColumnProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
} from "react-aria-components";

export type TableSize = "compact" | "comfortable";

/* ------------------------------------------------------------------ */
/*  Table                                                              */
/* ------------------------------------------------------------------ */

export interface DataTableProps extends TableProps {
  /** Row density */
  size?: TableSize;
}

const tableSizeClass: Record<TableSize, string> = {
  compact: "[--table-row-py:theme(spacing.1)]",
  comfortable: "[--table-row-py:theme(spacing.3)]",
};

export function Table({ size = "comfortable", className, ...props }: DataTableProps) {
  return (
    <AriaTable
      {...props}
      className={[
        "w-full border-collapse text-[var(--font-size-sm)] text-[var(--color-text-primary)]",
        tableSizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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

export function Column(props: ColumnProps) {
  return (
    <AriaColumn
      {...props}
      className={[
        "px-3 py-2 text-left font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]",
        "border-b-2 border-[var(--color-border-default)]",
        "cursor-default select-none outline-none",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-[-2px]",
      ].join(" ")}
    >
      {({ allowsSorting, sortDirection }) => (
        <span className="inline-flex items-center gap-1">
          {props.children as React.ReactNode}
          {allowsSorting && (
            <span aria-hidden="true" className="text-[var(--color-text-tertiary)]">
              {sortDirection === "ascending" ? "\u25B2" : sortDirection === "descending" ? "\u25BC" : "\u25B4"}
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

export function Row<T extends object>(props: RowProps<T>) {
  return (
    <AriaRow
      {...props}
      className={[
        "border-b border-[var(--color-border-default)]",
        "even:bg-[var(--color-surface-subtle)]",
        "hover:bg-[var(--color-surface-muted)]",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-[-2px]",
        "transition-colors",
      ].join(" ")}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Cell                                                               */
/* ------------------------------------------------------------------ */

export function Cell(props: CellProps) {
  return (
    <AriaCell
      {...props}
      className={[
        "px-3 py-[var(--table-row-py)]",
        "outline-none",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-border-focus)] focus-visible:outline-offset-[-2px]",
      ].join(" ")}
    />
  );
}
