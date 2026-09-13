import { Badge } from "../Badge";
import { IconButton } from "../IconButton";
import { Icon } from "../Icon";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import { Input } from "../Form/Input";
import { Select, type SelectItem } from "../Form/Select";
import { Column } from "@tanstack/react-table";
import { type ReactNode, useMemo, useState } from "react";

interface ColumnFilterInputProps {
  column: Column<unknown, unknown>;
  filterType: "text" | "select";
  filterPlaceholder?: string;
  filterOptions?: { label: string; value: string }[];
  /** Render a custom option for non-"All" values. The "All" option is
   *  always rendered as a slate Badge automatically. */
  filterRender?: (option: { label: string; value: string }) => ReactNode;
}

const ALL_KEY = "__all__";
const ALL_OPTION: SelectItem = { id: ALL_KEY, name: "All" };
const AllPill = () => <Badge color="slate">All</Badge>;

/**
 * Column filter (react-data-table default look): a small ghost funnel button
 * in the column header — with an active dot while a filter is set — opening
 * the filter control in a popover. Nothing filter-shaped renders inline, so
 * the header row stays visually quiet.
 */
export function ColumnFilterInput({
  column,
  filterType,
  filterPlaceholder,
  filterOptions,
  filterRender,
}: ColumnFilterInputProps) {
  const filterValue = (column.getFilterValue() as string) ?? "";
  const [isOpen, setIsOpen] = useState(false);

  const selectItems = useMemo((): SelectItem[] => {
    if (filterType !== "select") return [];
    if (filterOptions) {
      return [
        ALL_OPTION,
        ...filterOptions.filter((o) => o.value !== "").map((o) => ({ id: o.value, name: o.label })),
      ];
    }
    const facetedValues = column.getFacetedUniqueValues();
    return [
      ALL_OPTION,
      ...Array.from(facetedValues.keys())
        .filter((v) => v != null && v !== "")
        .map(String)
        .sort()
        .map((v) => ({ id: v, name: v })),
    ];
  }, [column, filterType, filterOptions]);

  const selectedKey = filterValue || ALL_KEY;

  const setFilter = (key: string) => column.setFilterValue(key === ALL_KEY ? undefined : key);

  const clearFilter = () => column.setFilterValue(undefined);

  const renderItem = useMemo(() => {
    if (!filterRender) return undefined;
    const render = filterRender;
    function FilterOption(item: SelectItem) {
      return item.id === ALL_KEY ? <AllPill /> : render({ label: item.name, value: item.id });
    }
    return FilterOption;
  }, [filterRender]);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="group" aria-label={`Filter by ${column.columnDef.header}`}>
        {/* A ghost funnel icon (react-data-table default look) with an active
            dot while a filter is set. Rendered as a styled span — the
            PopoverTrigger already wraps its child in the Aria button, and
            nesting a real <button> (IconButton) inside would be invalid
            HTML. */}
        <span
          aria-hidden="true"
          className="relative inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors group-hover:text-foreground group-focus-visible:text-foreground"
        >
          <Icon icon="Funnel" size="sm" />
          {filterValue && (
            <span className="pointer-events-none absolute right-1 top-1 size-1.5 rounded-full bg-primary" />
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent placement="bottom start" offset={4} className="w-56 p-3">
        <div className="flex flex-col gap-2 font-normal">
          {filterType === "select" ? (
            <Select
              size="sm"
              className="w-full"
              items={selectItems}
              value={selectedKey}
              onChange={(key) => setFilter(String(key))}
              aria-label={`Filter by ${column.columnDef.header}`}
              renderItem={renderItem}
            />
          ) : (
            <Input
              value={filterValue}
              onChange={setFilter}
              placeholder={filterPlaceholder ?? `Filter ${column.columnDef.header}...`}
              aria-label={`Filter by ${column.columnDef.header}`}
              size="sm"
            />
          )}
          {filterValue && (
            <IconButton
              icon="X"
              size="sm"
              variant="ghost"
              onPress={clearFilter}
              label="Clear filter"
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
