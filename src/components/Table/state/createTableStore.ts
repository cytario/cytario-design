import type { ColumnFiltersState, ColumnVisibilityState, SortingState } from "@tanstack/react-table";
import { createStore } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createMigrate } from "../persistMigration";

export interface TableStore {
  tableId: string;

  columnWidths: Record<string, number>;
  sorting: SortingState;
  columnVisibility: ColumnVisibilityState;
  columnFilters: ColumnFiltersState;

  setColumnWidth: (columnId: string, width: number) => void;
  setSorting: (sorting: SortingState) => void;
  setColumnVisibility: (visibility: ColumnVisibilityState) => void;
  setColumnFilters: (filters: ColumnFiltersState) => void;

  reset: () => void;
}

export const createTableStore = (tableId: string) =>
  createStore<TableStore>()(
    persist(
      devtools(
        (set) => ({
          tableId,
          columnWidths: {},
          sorting: [],
          columnVisibility: {},
          columnFilters: [],

          setColumnWidth: (columnId: string, width: number) =>
            set(
              (state) => ({
                columnWidths: {
                  ...state.columnWidths,
                  [columnId]: width,
                },
              }),
              false,
              "setColumnWidth",
            ),

          setSorting: (sorting: SortingState) => set({ sorting }, false, "setSorting"),

          setColumnVisibility: (columnVisibility: ColumnVisibilityState) =>
            set({ columnVisibility }, false, "setColumnVisibility"),

          setColumnFilters: (columnFilters: ColumnFiltersState) =>
            set({ columnFilters }, false, "setColumnFilters"),

          reset: () =>
            set(
              {
                columnWidths: {},
                sorting: [],
                columnVisibility: {},
                columnFilters: [],
              },
              false,
              "reset",
            ),
        }),
        { name: `TableStore-${tableId}` },
      ),
      {
        name: `TableStore-${tableId}`,
        version: 1,
        migrate: createMigrate(
          {
            0: () => ({
              columnWidths: {},
              sorting: [],
              columnVisibility: {},
              columnFilters: [],
            }),
          },
          {
            columnWidths: {},
            sorting: [],
            columnVisibility: {},
            columnFilters: [],
          },
        ),
        onRehydrateStorage: () => (_state, error) => {
          if (error) console.error(`[TableStore-${tableId}] Rehydration failed:`, error);
        },
      },
    ),
  );
