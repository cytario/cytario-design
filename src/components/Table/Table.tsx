import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { ReactNode, useCallback, useMemo, useRef } from "react";

import { EmptyState } from "../EmptyState";
import { IconButton } from "../IconButton";

import { NoFilterResults } from "./NoFilterResults";
import { TableBodyRow } from "./TableBodyRow";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableMenu } from "./TableMenu";
import { CellRenderers, TableProps } from "./types";
import { useColumnFilters } from "./useColumnFilters";
import { useColumnVisibility } from "./useColumnVisibility";
import { useColumnWidths } from "./useColumnWidths";
import { useTableSorting } from "./useTableSorting";

// Re-export types for external use
export type { ColumnConfig, TableProps, CellRenderers } from "./types";

function booleanSortingFn<TData>(rowA: Row<TData>, rowB: Row<TData>, columnId: string): number {
  const a = rowA.getValue<boolean>(columnId) ? 1 : 0;
  const b = rowB.getValue<boolean>(columnId) ? 1 : 0;
  return a - b;
}

export function Table<TData extends object>({
  columns,
  data,
  cellRenderers = {} as CellRenderers<TData>,
  tableId = "default",
  ariaLabel,
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  onRowPress,
  showFilters = true,
  defaultSorting,
  showIndex = true,
}: TableProps<TData>) {
  const { columnSizing, setColumnSizing } = useColumnWidths(columns, tableId);
  const anchorColumnId = columns.find((c) => c.anchor)?.id ?? columns[0]?.id;
  // Stable identity across renders: this feeds the controlled `state.sorting`.
  // A fresh array per render makes TanStack's internal-state update cascade
  // into an infinite synchronous re-render loop on the first discrete event
  // (e.g. a column-resize mousedown) while no sorting is persisted yet.
  const effectiveDefaultSorting = useMemo(
    () => defaultSorting ?? (anchorColumnId ? [{ id: anchorColumnId, desc: false }] : []),
    [defaultSorting, anchorColumnId],
  );
  const { sorting, setSorting } = useTableSorting(tableId, effectiveDefaultSorting);
  const { columnVisibility, setColumnVisibility, toggleableColumns, toggleColumn } =
    useColumnVisibility(columns, tableId);
  const { columnFilters, setColumnFilters, resetFilters } = useColumnFilters({
    tableId,
  });

  const SELECTION_COLUMN_SIZE = 48;
  const indexColumnSize = 48;

  const columnDefs: ColumnDef<TData>[] = useMemo(() => {
    const indexColumn: ColumnDef<TData> = {
      id: "index",
      header: "",
      cell: (info) => info.row.index + 1,
      enableResizing: false,
      enableSorting: false,
      enableColumnFilter: false,
      size: indexColumnSize,
      minSize: indexColumnSize,
      maxSize: indexColumnSize,
    };

    // Dedicated leading selection column (the react-data-table pattern):
    // whenever row selection is on, a fixed-width system column carries the
    // per-row checkbox, independent of the index column.
    const selectionColumn: ColumnDef<TData> = {
      id: "selection",
      header: "",
      enableResizing: false,
      enableSorting: false,
      enableColumnFilter: false,
      size: SELECTION_COLUMN_SIZE,
      minSize: SELECTION_COLUMN_SIZE,
      maxSize: SELECTION_COLUMN_SIZE,
    };

    const dataColumns = columns.map((colConfig) => {
      const renderer = cellRenderers[colConfig.id];

      return {
        id: colConfig.id,
        accessorKey: colConfig.id as string & keyof TData,
        header: colConfig.header,
        cell: renderer
          ? (info: { row: { original: TData }; getValue: () => unknown }) =>
              renderer(info.row.original)
          : (info: { getValue: () => unknown }) => info.getValue() as ReactNode,
        enableResizing: colConfig.enableResizing !== false,
        enableSorting: colConfig.enableSorting ?? false,
        enableColumnFilter: colConfig.enableColumnFilter ?? false,
        ...(colConfig.filterFn && { filterFn: colConfig.filterFn }),
        sortingFn:
          colConfig.sortingFn === "boolean"
            ? booleanSortingFn
            : (colConfig.sortingFn ?? "alphanumeric"),
        size: colConfig.size ?? 150,
        minSize: colConfig.minSize ?? 48,
        maxSize: colConfig.maxSize ?? Number.MAX_SAFE_INTEGER,
      } as ColumnDef<TData>;
    });

    const leading: ColumnDef<TData>[] = [];
    if (enableRowSelection) leading.push(selectionColumn);
    if (showIndex) leading.push(indexColumn);
    return [...leading, ...dataColumns];
  }, [columns, cellRenderers, indexColumnSize, showIndex, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableSortingRemoval: false,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableRowSelection: !!enableRowSelection,
    state: {
      columnSizing,
      sorting,
      columnVisibility,
      columnFilters,
      ...(enableRowSelection && { rowSelection }),
    },
    onColumnSizingChange: setColumnSizing,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    ...(getRowId && { getRowId: getRowId as (row: TData) => string }),
    ...(enableRowSelection && { onRowSelectionChange: onRowSelectionChange }),
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleHeaderScroll = useCallback(() => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    if (headerRef.current && bodyRef.current) {
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, []);

  const handleBodyScroll = useCallback(() => {
    if (isSyncing.current) return;
    isSyncing.current = true;
    if (bodyRef.current && headerRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, []);

  const filteredCount = table.getRowModel().rows.length;
  const totalCount = data.length;
  const isFiltered = filteredCount !== totalCount;
  // The first visible data column — cells in it carry no floating separator
  // (a leading separator would sit on the row's left edge).
  const firstVisibleColumnId = table
    .getVisibleLeafColumns()
    .find((c) => c.id !== "index")?.id;

  return (
    <>
      {/* Screen-reader announcement for filter changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isFiltered ? `Showing ${filteredCount} of ${totalCount} rows` : ""}
      </div>

      {/* Table controls, top-right above the table: the column picker
          (TableMenu) and the clear-all-filters action. Keeping them out of
          the header row leaves it visually quiet (react-data-table default
          look); a right-aligned row above the table mirrors their placement
          there. */}
      {(toggleableColumns.length > 0 || columnFilters.length > 0) && (
        <div className="flex items-center justify-end gap-1 pb-1">
          {columnFilters.length > 0 && (
            <IconButton
              icon="FilterX"
              size="sm"
              variant="ghost"
              onPress={resetFilters}
              label="Clear all filters"
            />
          )}
          {toggleableColumns.length > 0 && (
            <TableMenu
              toggleableColumns={toggleableColumns}
              columnVisibility={columnVisibility}
              toggleColumn={toggleColumn}
              tableId={tableId}
            />
          )}
        </div>
      )}

      {/* Sticky header — sticks vertically, scrolls horizontally (hidden
          scrollbar). The pb-1.5 gives the header a slight gap above the
          content rows instead of the border touching the first row. */}
      <div
        ref={headerRef}
        className="sticky top-0 z-10 bg-white border-b border-border pb-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
        onScroll={handleHeaderScroll}
      >
        <table className="min-w-full" aria-label={ariaLabel}>
          <thead className="w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHeaderRow
                key={headerGroup.id}
                headerGroup={headerGroup}
                columns={columns}
                enableRowSelection={!!enableRowSelection}
                showFilters={showFilters}
              />
            ))}
          </thead>
        </table>
      </div>

      {/* Scrollable body — horizontal scrollbar visible */}
      <div ref={bodyRef} className="overflow-x-auto" onScroll={handleBodyScroll}>
        <table className="min-w-full" aria-hidden="true">
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (enableRowSelection ? 1 : 0) + (showIndex ? 1 : 0)}>
                  <EmptyState icon="Inbox" title="No results" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (enableRowSelection ? 1 : 0) + (showIndex ? 1 : 0)}>
                  <NoFilterResults tableId={tableId} />
                </td>
              </tr>
            ) : (
              table
                .getRowModel()
                .rows.map((row, index) => (
                  <TableBodyRow
                    key={row.id}
                    row={row}
                    rowIndex={index}
                    columns={columns}
                    enableRowSelection={!!enableRowSelection}
                    showIndex={showIndex}
                    anchorDataColumnId={firstVisibleColumnId}
                    onRowPress={onRowPress ? (row) => onRowPress(row as TData) : null}
                  />
                ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
