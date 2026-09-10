import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { useStore } from "zustand";

import { useTableStore } from "./state/useTableStore";

/**
 * Manages sorting state for a table with persistence.
 *
 * When no stored sorting exists, falls back to `defaultSorting` — typically
 * the anchor column ascending, or a newest-first default for views that
 * list time-ordered entries.
 */
export function useTableSorting(tableId: string, defaultSorting: SortingState = []) {
  const store = useTableStore(tableId);

  const storedSorting = useStore(store, (state) => state.sorting);
  const setSortingStore = useStore(store, (state) => state.setSorting);

  const sorting = storedSorting.length > 0 ? storedSorting : defaultSorting;

  const setSorting: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue) => {
      const currentSorting = store.getState().sorting;
      const current = currentSorting.length > 0 ? currentSorting : defaultSorting;

      const next = typeof updaterOrValue === "function" ? updaterOrValue(current) : updaterOrValue;

      setSortingStore(next);
    },
    [store, setSortingStore, defaultSorting],
  );

  return { sorting, setSorting };
}
