import type { FilterFn, OnChangeFn, RowSelectionState, SortingState } from "@tanstack/react-table";
import { ReactNode } from "react";

// Behavior props aligned with TanStack naming. Spelled out rather than picked
// from TanStack's `ColumnDefBase`, so this one does not pull a TanStack type
// onto the public surface for a single boolean.
type ColumnBehavior = {
  enableResizing?: boolean;
};

// Sorting props (built-in algorithm names only; with typed data, custom
// SortingAccessor functions are no longer needed)
interface ColumnSorting {
  enableSorting?: boolean;
  sortingFn?: "alphanumeric" | "datetime" | "basic" | "boolean";
}

// Sizing props (aligned with TanStack naming)
interface ColumnSizing {
  size: number; // Default width in px
  minSize?: number; // Min width (default: 48)
  maxSize?: number; // Max width (default: MAX_SAFE_INTEGER)
}

// Display props (custom, not in TanStack)
interface ColumnDisplay {
  align?: "left" | "right" | "center";
  monospace?: boolean;
  ellipsis?: "left" | "middle" | "right";
  copyable?: boolean;
}

// Filtering props
interface ColumnFiltering {
  enableColumnFilter?: boolean;
  filterType?: "text" | "select";
  filterPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  filterRender?: (option: { label: string; value: string }) => ReactNode;
  filterFn?: FilterFn<unknown>;
}

// Visibility props
interface ColumnVisibility {
  defaultVisible?: boolean; // defaults to true if omitted
  anchor?: boolean; // always visible, cannot be hidden
}

export interface ColumnConfig
  extends
    ColumnBehavior,
    ColumnSorting,
    ColumnSizing,
    ColumnDisplay,
    ColumnFiltering,
    ColumnVisibility {
  id: string;
  header: string;
}

/**
 * Maps column IDs to render functions. Each function receives the full typed
 * row object and returns a ReactNode. Columns without a renderer display
 * their raw accessor value.
 */
export type CellRenderers<TData> = Partial<Record<string, (row: TData) => ReactNode>>;

/**
 * Controlled group-expansion state, keyed by TanStack's group row id
 * (`${columnId}:${value}`).
 */
export type ExpandedRowsState = Record<string, boolean>;

/**
 * Renders a group row's cells. TanStack's grouped row model hands the Table a
 * group row per distinct value; left to itself each cell would show the raw
 * group value only in the grouping column. This renderer lets the consumer
 * style the group's own row — its cells span the real columns, so the group
 * sits in the column grid and the leaf rows stay intact beneath it.
 */
export type GroupCellRenderers<TData> = Partial<
  Record<string, (group: GroupRowContext<TData>) => ReactNode>
>;

export interface GroupRowContext<TData> {
  /** The value shared by the group's rows. */
  value: unknown;
  /** The grouping column id. */
  columnId: string;
  /** The rows in the group (its leaf rows, flattened). */
  rows: TData[];
  /** Number of leaf rows in the group. */
  count: number;
  /** Whether the group is expanded (its leaf rows are shown). */
  isExpanded: boolean;
  /** Toggle the group's expansion. */
  toggleExpanded: () => void;
  /** The group's nesting depth — 0 for the outermost grouping. */
  depth: number;
}

export interface TableProps<TData extends object> {
  columns: ColumnConfig[];
  data: TData[];
  cellRenderers?: CellRenderers<TData>;
  tableId?: string;
  ariaLabel?: string;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (row: TData) => string;
  /**
   * Row activation: called when an actionable row is clicked or activated
   * with Enter/Space. Setting it renders rows with a pointer cursor so the
   * affordance is discoverable. Interactive cell content (links, copy
   * affordances) stops propagation and never activates the row.
   */
  onRowPress?: (row: TData) => void;
  showFilters?: boolean;
  /** Sorting used when the viewer has no persisted preference — defaults to
   *  the anchor column ascending. */
  defaultSorting?: SortingState;
  /** Whether to render the leading index (line-number) column. Defaults to
   *  true (historical behavior). When false, the column-picker menu and the
   *  clear-all-filters action — which otherwise live in the index column's
   *  header — anchor to the first visible column header instead. */
  showIndex?: boolean;
  /**
   * Grouping: a column id whose values rows are grouped by. Group rows render
   * as ordinary rows in the column grid (styled by `groupCellRenderers`),
   * with the leaf rows intact beneath an expanded group — the ag-grid shape.
   * Filters apply to leaf rows; a group whose leaves are all filtered out
   * does not render. Omit for the flat table.
   */
  groupBy?: string;
  /** Cell renderers for a group row, keyed by column id. */
  groupCellRenderers?: GroupCellRenderers<TData>;
  /** Groups expanded by default — defaults to false (collapsed). */
  defaultExpandedGroups?: boolean;
  /**
   * Controlled group expansion, keyed by group row id (`${columnId}:${value}`).
   * Controlled requires `onExpandedGroupsChange` — without it the Table owns
   * the state and this prop is ignored.
   */
  expandedGroups?: ExpandedRowsState;
  onExpandedGroupsChange?: (
    updater: ExpandedRowsState | ((prev: ExpandedRowsState) => ExpandedRowsState),
  ) => void;
}
