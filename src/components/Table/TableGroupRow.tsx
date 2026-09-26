import { Checkbox } from "../Form/Checkbox";
import { Row } from "@tanstack/react-table";
import { KeyboardEvent, useCallback } from "react";
import { twMerge } from "tailwind-merge";

import { Icon } from "../Icon";
import { ColumnConfig, GroupCellRenderers, GroupRowContext } from "./types";

interface TableGroupRowProps<TData> {
  row: Row<TData>;
  columns: ColumnConfig[];
  /** The column the table is grouped by — its cell carries the toggle. */
  groupColumnId: string;
  /** Everything a group cell renderer needs about this group. */
  context: GroupRowContext<TData>;
  renderers?: GroupCellRenderers<TData>;
  /** Id of the first visible data column — its cell carries no separator. */
  anchorDataColumnId?: string;
  /** Whether rows carry a selection checkbox; the group's selects its leaves. */
  enableRowSelection: boolean;
}

/**
 * A group row: an ordinary row in the column grid (the ag-grid shape), not a
 * full-width band. Its cells are the real columns — the grouping column shows
 * the group's value with the expand/collapse toggle, and the other columns
 * render whatever `groupCellRenderers` supplies (an aggregate, a summary, or
 * nothing). The grouping cell is indented by the group's depth so a
 * multi-level grouping reads as a hierarchy.
 */
export function TableGroupRow<TData>({
  row,
  columns,
  groupColumnId,
  context,
  renderers,
  anchorDataColumnId,
  enableRowSelection,
}: TableGroupRowProps<TData>) {
  const isExpanded = row.getIsExpanded();

  // Same keyboard contract as a body row: arrows move between rows, Enter
  // toggles the group instead of activating it (WAI-ARIA disclosure
  // pattern). Without tabIndex the arrow navigation a body row offers would
  // drop focus onto the group row.
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTableRowElement>) => {
    const tr = event.currentTarget;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      (tr.nextElementSibling as HTMLElement | null)?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      (tr.previousElementSibling as HTMLElement | null)?.focus();
    } else if (event.key === "Enter" || event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      row.toggleExpanded();
    }
  }, [row]);

  // TanStack emits a cell only for a *visible* column, so a hidden grouping
  // column has no cell of its own to carry the toggle. Fall back to the first
  // visible column — a group row must always expose its expand affordance.
  const visibleGroupColumnId = row
    .getVisibleCells()
    .some((cell) => cell.column.id === groupColumnId)
    ? groupColumnId
    : anchorDataColumnId;

  return (
    <tr
      data-group-row=""
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      className={twMerge(
        "w-full block border-b border-border bg-muted/60",
        "hover:bg-muted transition-colors",
        "focus-visible:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id;
        // The system columns keep their fixed width here, or the group row's
        // grid drifts out of line with the leaf rows beneath it.
        const systemStyle = {
          width: cell.column.getSize(),
          minWidth: cell.column.getSize(),
          maxWidth: cell.column.getSize(),
        };

        // The group carries its own tri-state checkbox: it selects the leaves
        // beneath it (TanStack's `toggleSelected` cascades to sub-rows) and
        // reports their collective state. It is a real control, not the leaf
        // rows' checkbox repeated.
        if (columnId === "selection") {
          return (
            <td key={cell.id} className="relative p-2" style={systemStyle}>
              {enableRowSelection && (
                <Checkbox
                  isSelected={row.getIsAllSubRowsSelected()}
                  isIndeterminate={row.getIsSomeSelected()}
                  onChange={() => row.toggleSelected()}
                  aria-label={`Select all rows in ${String(context.value ?? "")}`}
                />
              )}
            </td>
          );
        }

        // The index column is a line number, which a group has none of.
        if (columnId === "index") {
          return <td key={cell.id} className="relative p-2" style={systemStyle} aria-hidden="true" />;
        }

        const columnConfig = columns.find((c) => c.id === columnId);
        if (!columnConfig) return null;

        const isGroupColumn = columnId === visibleGroupColumnId;
        const isFirstDataCell = columnId === anchorDataColumnId;
        const isRight = columnConfig.align === "right";
        const alignClass = isRight
          ? "text-right"
          : columnConfig.align === "center"
            ? "text-center"
            : "text-left";

        const style = {
          width: cell.column.getSize(),
          minWidth: cell.column.getSize(),
          maxWidth: cell.column.getSize(),
        };

        const renderer = renderers?.[columnId];
        const content = isGroupColumn ? (
          // The grouping cell: the expand/collapse toggle, then the consumer's
          // label beside it. The label is a *sibling* of the toggle, not its
          // content — so a consumer can put its own actions in the group row
          // without nesting interactive elements.
          <div
            className="flex w-full items-center gap-1.5"
            // Indent nested groups so a multi-level grouping reads as a
            // hierarchy rather than a flat list.
            style={{ paddingLeft: context.depth > 0 ? context.depth * 16 : undefined }}
          >
            <button
              type="button"
              onClick={() => row.toggleExpanded()}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} group ${String(context.value ?? "")}`}
              className={twMerge(
                "shrink-0 rounded-sm text-muted-foreground transition-colors",
                "hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              )}
            >
              {/* Collapsed points right, expanded points down — the chevron
                  itself, not a rotated glyph. */}
              <Icon icon={isExpanded ? "ChevronDown" : "ChevronRight"} size="sm" />
            </button>
            <span className="min-w-0 truncate font-medium text-foreground">
              {renderer ? renderer(context) : String(context.value ?? "")}
            </span>
          </div>
        ) : renderer ? (
          renderer(context)
        ) : null;

        return (
          <td
            key={cell.id}
            className={twMerge(
              "relative px-4 py-2 text-sm",
              alignClass,
              columnConfig.monospace && "font-mono font-light",
              isRight && "tabular-nums",
            )}
            style={style}
          >
            {!isFirstDataCell && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-[20%] left-0 w-px bg-border"
              />
            )}
            {content}
          </td>
        );
      })}
    </tr>
  );
}