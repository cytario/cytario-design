import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_weakEquals,
  rowExpandingFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  tableFeatures,
  type Column,
  type ColumnDef,
  type Header,
  type HeaderGroup,
  type Row,
  type RowData,
} from "@tanstack/react-table";

/**
 * The TanStack v9 features this Table turns on. v9 only exposes a feature's
 * APIs when it is registered here, and the object must keep a stable identity
 * across renders — hence module scope.
 *
 * The `filterFns`/`sortFns` registries carry only the built-ins the Table can
 * name: the `auto` filter TanStack applies to an unconfigured filterable
 * column, and the sort algorithm names `ColumnConfig.sortingFn` accepts.
 */
export const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  columnFacetingFeature,
  rowSortingFeature,
  rowSelectionFeature,
  columnGroupingFeature,
  rowExpandingFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  sortedRowModel: createSortedRowModel(),
  groupedRowModel: createGroupedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    equals: filterFn_equals,
    weakEquals: filterFn_weakEquals,
    arrIncludes: filterFn_arrIncludes,
    inDateRange: filterFn_inDateRange,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
});

/** The feature set the Table's default export ships, for typing internals. */
export type TableFeatureSet = typeof features;

// v9 threads its feature set through every core type. These aliases keep the
// Table's sub-components readable without repeating the feature argument, and
// keep their data parameter as loose as it was before the migration.
export type TableRow<TData extends RowData = RowData> = Row<TableFeatureSet, TData>;
export type TableColumn<TData extends RowData = RowData> = Column<TableFeatureSet, TData, unknown>;
export type TableHeader<TData extends RowData = RowData> = Header<TableFeatureSet, TData, unknown>;
export type TableHeaderGroup<TData extends RowData = RowData> = HeaderGroup<TableFeatureSet, TData>;
export type TableColumnDef<TData extends RowData> = ColumnDef<TableFeatureSet, TData>;
