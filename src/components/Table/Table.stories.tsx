import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";

import { Badge } from "../Badge";
import { Button } from "../Button";
import { SelectionFooter } from "./SelectionFooter";
import { Table, type CellRenderers, type ColumnConfig } from "./Table";

interface Job {
  id: string;
  application: string;
  status: string;
  submittedBy: string;
  submittedAt: string;
}

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

// --- Real-world usage story (jobs list, from the compute plugin) ---

const columns: ColumnConfig[] = [
  {
    id: "application",
    header: "Application",
    size: 260,
    anchor: true,
    enableSorting: true,
    enableColumnFilter: true,
    filterType: "text",
    filterPlaceholder: "Filter by application...",
  },
  {
    id: "status",
    header: "Status",
    size: 180,
    enableSorting: true,
    enableColumnFilter: true,
    filterType: "select",
    filterOptions: [
      { label: "Queued", value: "Queued" },
      { label: "Running", value: "Running" },
      { label: "Completed", value: "Completed" },
      { label: "Failed", value: "Failed" },
    ],
    filterRender: (option) => <Badge color="teal">{option.label}</Badge>,
  },
  { id: "submittedBy", header: "Submitted by", size: 160, enableSorting: true },
  { id: "submittedAt", header: "Submitted", size: 200, enableSorting: true },
];

const data: Job[] = [
  {
    id: "job-1",
    application: "tissue-classifier : 1.1.2",
    status: "Running",
    submittedBy: "jdoe",
    submittedAt: "2026-09-08T09:41:00Z",
  },
  {
    id: "job-2",
    application: "cell-segmentation : 2.0.0",
    status: "Completed",
    submittedBy: "asmith",
    submittedAt: "2026-09-07T15:02:00Z",
  },
  {
    id: "job-3",
    application: "marker-quantification : 0.9.4",
    status: "Failed",
    submittedBy: "jdoe",
    submittedAt: "2026-09-06T08:12:00Z",
  },
];

const cellRenderers: CellRenderers<Job> = {
  application: (row) => row.application,
  status: (row) => <Badge color="teal">{row.status}</Badge>,
  submittedBy: (row) => row.submittedBy,
  submittedAt: (row) => row.submittedAt,
};

export const JobsList: Story = {
  name: "Jobs List",
  render: () => (
    <Table
      columns={columns}
      data={data}
      cellRenderers={cellRenderers}
      tableId="storybook-jobs"
      ariaLabel="Jobs"
    />
  ),
};

// --- showIndex opt-out ---

export const JobsListNoIndex: Story = {
  name: "Jobs List (no line numbers)",
  parameters: { docs: { description: { story: "Same table with `showIndex={false}` — the line-number column is omitted and the column-picker menu anchors to the first column header." } } },
  render: () => (
    <Table
      columns={columns}
      data={data}
      cellRenderers={cellRenderers}
      tableId="storybook-jobs-noindex"
      ariaLabel="Jobs"
      showIndex={false}
    />
  ),
};

// --- Playground: every table control wired via args ---

const playgroundDataset: Job[] = Array.from({ length: 20 }, (_, i) => ({
  id: `job-${i}`,
  application: `tissue-classifier : 1.${i % 5}.2`,
  status: ["Queued", "Running", "Completed", "Failed"][i % 4]!,
  submittedBy: ["jdoe", "asmith", "npatel"][i % 3]!,
  submittedAt: new Date(Date.UTC(2026, 8, 8 - Math.floor(i / 4), 9 + (i % 8))).toISOString(),
}));

export const Playground: Story = {
  parameters: { docs: { description: { story: "Every Table control wired — toggles for the system columns, filters, and row selection (with a selection footer and a bulk-action stub so selection behavior is observable)." } } },
  args: {
    enableRowSelection: true,
    showIndex: false,
    showFilters: true,
    onRowPress: undefined,
  },
  argTypes: {
    enableRowSelection: { control: "boolean", description: "Dedicated selection column with per-row checkboxes + select-all" },
    showIndex: { control: "boolean", description: "Line-number column" },
    showFilters: { control: "boolean", description: "Per-column filter triggers (funnel popovers)" },
    onRowPress: { action: "rowPress", description: "Row activation — toggling this in the args table wires rows as actionable (pointer cursor, Enter/Space activation)" },
  },
  render: ({ enableRowSelection, showIndex, showFilters, onRowPress }) => {
    function SelectionPlayground() {
      const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
      const selectedCount = Object.keys(rowSelection).length;
      return (
        <div>
          <Table
            columns={columns}
            data={playgroundDataset}
            cellRenderers={cellRenderers}
            tableId="storybook-playground"
            ariaLabel="Playground"
            showIndex={showIndex}
            showFilters={showFilters}
            enableRowSelection={enableRowSelection}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            onRowPress={onRowPress}
          />
          {enableRowSelection && selectedCount > 0 && (
            <SelectionFooter
              selectedCount={selectedCount}
              totalCount={playgroundDataset.length}
              onReset={() => setRowSelection({})}
            >
              <Button variant="secondary" size="sm" onPress={() => setRowSelection({})}>
                Stub bulk action ({selectedCount})
              </Button>
            </SelectionFooter>
          )}
        </div>
      );
    }
    return <SelectionPlayground />;
  },
};
