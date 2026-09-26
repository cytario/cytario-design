import { Checkbox } from "../Form/Checkbox";
import { TruncatedText } from "../TruncatedText";
import { Row, flexRender } from "@tanstack/react-table";
import { KeyboardEvent, useCallback } from "react";
import { twMerge } from "tailwind-merge";

import { ColumnConfig } from "./types";

interface TableBodyRowProps {
  row: Row<unknown>;
  rowIndex: number;
  columns: ColumnConfig[];
  enableRowSelection: boolean;
  /** Whether the leading index column exists. */
  showIndex: boolean;
  /** Id of the first visible data column — its cells carry no separator. */
  anchorDataColumnId?: string;
  /** Row activation handler — null when rows are not actionable. */
  onRowPress: ((row: unknown) => void) | null;
  className?: string;
}

export function TableBodyRow({
  row,
  rowIndex,
  columns,
  enableRowSelection,
  showIndex,
  anchorDataColumnId,
  onRowPress,
  className,
}: TableBodyRowProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTableRowElement>) => {
    const tr = event.currentTarget;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = tr.nextElementSibling as HTMLElement | null;
      next?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = tr.previousElementSibling as HTMLElement | null;
      prev?.focus();
    } else if (event.key === "Enter" && onRowPress) {
      event.preventDefault();
      onRowPress(row.original);
    } else if (event.key === "Enter") {
      const link = tr.querySelector("a");
      link?.click();
    }
  }, [onRowPress, row.original]);

  return (
    <tr
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={
        onRowPress
          ? (event) => {
              // Interactive cell content owns its clicks — never swallow them
              // into a row activation.
              if ((event.target as HTMLElement).closest("a, [role='button'], [data-copy]"))
                return;
              onRowPress(row.original);
            }
          : undefined
      }
      className={twMerge(
        "w-full block border-b border-border",
        "hover:bg-card transition-colors",
        "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        onRowPress && "cursor-pointer",
        row.getIsSelected() && "bg-accent",
        className,
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const isSelectionColumn = cell.column.id === "selection";
        if (isSelectionColumn) {
          return (
            <td key={cell.id} className="relative p-2" style={{ width: cell.column.getSize() }}>
              <Checkbox
                isSelected={row.getIsSelected()}
                onChange={() => row.toggleSelected()}
                aria-label="Select row"
              />
            </td>
          );
        }
        const isIndexColumn = cell.column.id === "index";
        const columnConfig = columns.find((col) => col.id === cell.column.id);
        // The first data cell (after the index column, when present) carries no
        // leading separator — it would sit on the row's left edge.
        const isFirstDataCell =
          cell.column.id === anchorDataColumnId;

        const isRight = columnConfig?.align === "right";
        const alignClass = isRight
          ? "text-right"
          : columnConfig?.align === "center"
            ? "text-center"
            : "text-left";
        const cxCell = twMerge(
          "relative px-4 py-2",
          isIndexColumn ? "text-right" : alignClass,
          columnConfig?.monospace && "font-mono font-light",
          (isRight || isIndexColumn) && "tabular-nums",
          !columnConfig?.anchor && !isIndexColumn && "text-sm",
        );

        const style = {
          width: cell.column.getSize(),
          minWidth: cell.column.getSize(),
          maxWidth: cell.column.getSize(),
        };

        const rawValue = cell.getValue();
        const useRawString = columnConfig?.ellipsis === "middle" && typeof rawValue === "string";

        const content = isIndexColumn
          ? rowIndex + 1
          : useRawString
            ? rawValue
            : flexRender(cell.column.columnDef.cell, cell.getContext());

        const copyValue =
          columnConfig?.copyable && typeof rawValue === "string" ? rawValue : undefined;

        return isIndexColumn ? (
          <th key={cell.id} className="relative p-2" style={style}>
            <div className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums justify-between">
              <span>{rowIndex + 1}</span>
            </div>
          </th>
        ) : (
          <td key={cell.id} className={cxCell} style={style}>
            {/* Floating column separator (react-data-table default look): a
                1px line in the middle 60% of the cell, never touching the
                horizontal row lines. Rendered on every cell that follows
                another visible cell so it never appears on the first. */}
            {!isFirstDataCell && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[20%] left-0 w-px bg-border"
              />
            )}
            <TruncatedText ellipsis={columnConfig?.ellipsis} copyValue={copyValue}>
              {content}
            </TruncatedText>
          </td>
        );
      })}
    </tr>
  );
}
