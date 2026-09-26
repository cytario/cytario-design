import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  getExpandedRowModel,
  ColumnDef,
  type ExpandedState,
  type Row,
  type RowSelectionState,
} from "@tanstack/react-table";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";

import { EmptyState } from "../EmptyState";
import { IconButton } from "../IconButton";

import { NoFilterResults } from "./NoFilterResults";
import { TableBodyRow } from "./TableBodyRow";
import { TableGroupRow } from "./TableGroupRow";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableMenu } from "./TableMenu";
import { CellRenderers, ColumnConfig, ExpandedRowsState, GroupRowContext, TableProps } from "./types";
import { useColumnFilters } from "./useColumnFilters";
import { useColumnVisibility } from "./useColumnVisibility";
import { useColumnWidths } from "./useColumnWidths";
import { useTableSorting } from "./useTableSorting";

// Re-export types for external use
export type {
  ColumnConfig,
  TableProps,
  CellRenderers,
  ExpandedRowsState,
  GroupCellRenderers,
  GroupRowContext,
} from "./types";

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
  groupBy,
  groupCellRenderers,
  defaultExpandedGroups = false,
  expandedGroups: expandedGroupsProp,
  onExpandedGroupsChange,
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
  // Selection falls back to internal state when the consumer does not control
  // it, exactly like the other table state — TanStack reads `state.rowSelection`
  // on every select-all and cannot take `undefined`.
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const effectiveRowSelection = rowSelection ?? internalRowSelection;
  const { columnVisibility, setColumnVisibility, toggleableColumns, toggleColumn } =
    useColumnVisibility(columns, tableId);
  const { columnFilters, setColumnFilters, resetFilters } = useColumnFilters({
    tableId,
  });

  // Grouping is opt-in. The expanded state is keyed by TanStack's group row
  // ids (`${columnId}:${value}`); `defaultExpandedGroups` seeds it as the
  // boolean shorthand TanStack reads for "everything open". Controlled
  // expansion requires `onExpandedGroupsChange` — without it the Table owns
  // the state, so a passed `expandedGroups` is ignored rather than producing
  // a table whose toggles silently do nothing.
  const isGrouped = !!groupBy;
  const grouping = useMemo(() => (groupBy ? [groupBy] : []), [groupBy]);
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>(() =>
    isGrouped && defaultExpandedGroups ? true : {},
  );
  const isControlled = isGrouped && !!onExpandedGroupsChange;
  const expandedState: ExpandedState = useMemo(
    () => (isControlled ? expandedGroupsProp ?? {} : isGrouped ? internalExpanded : {}),
    [isControlled, expandedGroupsProp, isGrouped, internalExpanded],
  );
  const setExpandedState = useCallback(
    (updater: ExpandedState | ((prev: ExpandedState) => ExpandedState)) => {
      setInternalExpanded((prev) =>
        typeof updater === "function" ? updater(prev) : updater,
      );
    },
    [],
  );
  // Translate TanStack's updater (whose ExpandedState type includes the
  // `true` shorthand) into the public Record form once, here — consumers
  // never see TanStack's raw updater shapes. `true` only ever enters as
  // initial state (`defaultExpandedGroups`); the internal path hands the
  // raw updater to TanStack's own state setter, which understands `true`,
  // while the public callback only ever sees Records.
  const applyExpandedChange = useCallback(
    (updater: ExpandedState | ((prev: ExpandedState) => ExpandedState)) => {
      if (onExpandedGroupsChange) {
        const resolve = (prev: ExpandedRowsState): ExpandedRowsState => {
          const next = typeof updater === "function" ? updater(prev) : updater;
          return next === true ? prev : (next as ExpandedRowsState);
        };
        onExpandedGroupsChange(resolve);
      } else {
        setExpandedState(updater);
      }
    },
    [onExpandedGroupsChange, setExpandedState],
  );

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
        // TanStack groups by a column's `accessorFn`/`accessorKey` value and
        // only renders the group's own cell in the grouping column; the other
        // cells fall to `getValue` on the group row. An explicit
        // `getGroupingValue` is not needed — the accessor key is the value.
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
    ...(isGrouped && {
      getGroupedRowModel: getGroupedRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      // TanStack's default ('reorder') moves the grouping column to the front of
      // the order, which shoves the leading system columns (selection, index)
      // out of first place. The consumer already places the grouping column
      // where it belongs, so leave the order alone.
      groupedColumnMode: false,
      // Filters rebuild the grouped row model; without this the expanded
      // state auto-resets to {} on every filter change, collapsing groups
      // under a header that still reads "expanded".
      autoResetExpanded: false,
    }),
    enableSortingRemoval: false,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enableRowSelection: !!enableRowSelection,
    state: {
      columnSizing,
      sorting,
      columnVisibility,
      columnFilters,
      ...(isGrouped && { grouping, expanded: expandedState }),
      ...(enableRowSelection && { rowSelection: effectiveRowSelection }),
    },
    ...(isGrouped && { onExpandedChange: applyExpandedChange }),
    onColumnSizingChange: setColumnSizing,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    // `getRowId` is a row-identity concern (selection keys, and the ids an
    // expandable detail row is keyed by), not a selection-only option.
    ...(getRowId && { getRowId: getRowId as (row: TData) => string }),
    ...(enableRowSelection && {
      onRowSelectionChange: onRowSelectionChange ?? setInternalRowSelection,
    }),
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

  const rowModel = table.getRowModel();
  // The leaf rows currently in the body — what the filtered-count
  // announcement sees. Read from the filtered row model each render:
  // TanStack memoizes that accessor internally, so it is cheap and stays
  // correct across a filter change. A grouped model's own rows include the
  // group rows, so take the leaves (collapsed or not) instead.
  const visibleRows = table.getFilteredRowModel().rows.map((row) => row.original);
  const filteredCount = visibleRows.length;
  const totalCount = data.length;
  const isFiltered = filteredCount !== totalCount;
  // The first visible data column — cells in it carry no floating separator
  // (a leading separator would sit on the row's left edge).
  const firstVisibleColumnId = table
    .getVisibleLeafColumns()
    .find((c) => c.id !== "index")?.id;

  const colSpan = columns.length + (enableRowSelection ? 1 : 0) + (showIndex ? 1 : 0);

  const groupContext = (row: Row<TData>, groupColumnId: string): GroupRowContext<TData> => ({
    value: row.getGroupingValue(groupColumnId),
    columnId: groupColumnId,
    rows: row.getLeafRows().map((r) => r.original),
    count: row.getLeafRows().length,
    isExpanded: row.getIsExpanded(),
    toggleExpanded: () => row.toggleExpanded(),
    depth: row.depth,
  });

  // A singleton group renders as its leaf's plain row, and the grouped row
  // model ALSO lists that leaf as its own entry — collect the ones already
  // rendered so the flat pass skips them.
  const singletonLeafIds = new Set<string>();

  return (
    <>
      {/* Screen-reader announcement for filter changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isFiltered ? `Showing ${filteredCount} of ${totalCount} rows` : ""}
      </div>

      {/* Table controls, top-right above the table: the column picker
          (TableMenu) and the clear-all-filters action. */}
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

      {/* Scrollable body — horizontal scrollbar visible. Not aria-hidden: the
          rows are the table's real content, and a row's interactive controls
          must stay reachable. Labelled separately from the header table so
          assistive tech announces the two split-region tables distinctly. */}
      <div ref={bodyRef} className="overflow-x-auto" onScroll={handleBodyScroll}>
        <table className="min-w-full" aria-label={ariaLabel ? `${ariaLabel} rows` : undefined}>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <EmptyState icon="Inbox" title="No results" />
                </td>
              </tr>
            ) : rowModel.rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <NoFilterResults tableId={tableId} />
                </td>
              </tr>
            ) : (
              rowModel.rows.map((row, index) => {
                if (isGrouped && row.getIsGrouped()) {
                  const groupColumnId = row.groupingColumnId ?? groupBy!;
                  const leaves = row.getLeafRows();
                  // A group with exactly one leaf row has nothing to roll up,
                  // so it renders as a plain row: the leaf's own cells, no
                  // toggle, no group styling. This is what keeps a row the
                  // consumer did not mean to group (an ungroupable value)
                  // reading as a standalone row rather than acquiring a
                  // header of its own.
                  if (leaves.length === 1) {
                    const leaf = leaves[0]!;
                    // The grouped model flattens a group's subrows into the
                    // row list, so this leaf ALSO appears as its own entry —
                    // record it so the flat pass below does not render it a
                    // second time.
                    singletonLeafIds.add(String(leaf.id));
                    return (
                      <TableBodyRow
                        key={row.id}
                        row={leaf}
                        rowIndex={index}
                        columns={columns}
                        enableRowSelection={!!enableRowSelection}
                        showIndex={showIndex}
                        anchorDataColumnId={firstVisibleColumnId}
                        onRowPress={onRowPress ? (row) => onRowPress(row as TData) : null}
                      />
                    );
                  }
                  return (
                    <TableGroupRow
                      key={row.id}
                      row={row}
                      columns={columns}
                      groupColumnId={groupColumnId}
                      context={groupContext(row, groupColumnId)}
                      renderers={groupCellRenderers}
                      anchorDataColumnId={firstVisibleColumnId}
                      enableRowSelection={!!enableRowSelection}
                    />
                  );
                }
                // A leaf already rendered as its singleton group's row.
                if (singletonLeafIds.has(String(row.id))) return null;
                return (
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
