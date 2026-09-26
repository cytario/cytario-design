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
    groupBy: "Status"
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

// --- Grouped rows (grouped by column, from the compute plugin jobs view) ---

interface BatchJob {
  id: string;
  /**
   * The grouping value: the batch's identity for a batched job, or the job's
   * own id for one with no batch — so two unbatched jobs never group together
   * and each renders as a plain row.
   */
  batchKey: string;
  /** The Batch column's display value. */
  batchLabel: string;
  input: string;
  status: "Queued" | "Running" | "Completed" | "Failed";
  app: string;
  appVersion: string;
  submittedBy: string;
  submittedAgo: string;
  duration: string;
}

/**
 * Synthetic jobs-list data (no real slides or orgs): one large batch submitted
 * 9 hours ago, plus three older one-off jobs that each render as a plain row.
 */
const BATCH_SUBMITTED = "9 hours ago";
const BATCH_ID = "batch-9h";

/** The 9-hours-ago batch: 18 queued, then a running/completed mix. */
const BATCH_JOBS: Array<Pick<BatchJob, "status" | "duration">> = [
  ...Array.from({ length: 18 }, () => ({ status: "Queued" as const, duration: "—" })),
  { status: "Completed", duration: "1m 43s" },
  { status: "Completed", duration: "9m 48s" },
  { status: "Completed", duration: "18m 50s" },
  { status: "Completed", duration: "23m 28s" },
  { status: "Running", duration: "5h 18m" },
  { status: "Completed", duration: "7m 38s" },
  { status: "Completed", duration: "33m 11s" },
  { status: "Completed", duration: "17m 19s" },
  { status: "Completed", duration: "2m 19s" },
  { status: "Completed", duration: "23m 4s" },
  { status: "Completed", duration: "34m 38s" },
  { status: "Completed", duration: "24m 32s" },
  { status: "Completed", duration: "52m 54s" },
  { status: "Completed", duration: "7m 24s" },
  { status: "Completed", duration: "25m 3s" },
  { status: "Completed", duration: "33m 53s" },
  { status: "Completed", duration: "14m 13s" },
  { status: "Completed", duration: "14m 45s" },
  { status: "Completed", duration: "8m 46s" },
  { status: "Completed", duration: "17m 5s" },
  { status: "Completed", duration: "19m 45s" },
  { status: "Completed", duration: "15m 21s" },
  { status: "Completed", duration: "25m 13s" },
  { status: "Completed", duration: "12m 11s" },
];

// Deterministic synthetic ids — stable across renders, no real identifiers.
const fakeJobId = (n: number) =>
  `${(0x8a2f4c1d + n * 0x1f3b7).toString(16).padStart(8, "0").slice(0, 8)}-` +
  `${(n * 0x9e37).toString(16).padStart(4, "0").slice(0, 4)}-4b71-9c${(n % 16).toString(16)}-` +
  `${String(n).padStart(12, "0")}`;

const batchJobs: BatchJob[] = BATCH_JOBS.map((j, i) => ({
  id: fakeJobId(i + 1),
  batchKey: BATCH_ID,
  batchLabel: `Batch of ${BATCH_JOBS.length}`,
  input: i < 20 ? `WSI-2026-71${359 - i}-2.ome` : `WSI-2026-69${292 - (i - 20)}-8.ome`,
  status: j.status,
  app: "path-analyzer",
  appVersion: "6.1.4",
  submittedBy: "a.novak",
  submittedAgo: BATCH_SUBMITTED,
  duration: j.duration,
}));

/** Three older one-off jobs (failed) — each its own plain row. */
const olderJobs: BatchJob[] = [
  { id: fakeJobId(90), batchKey: fakeJobId(90), batchLabel: "—", input: "WSI-2026-70488-2.ome", status: "Failed", app: "path-analyzer", appVersion: "6.0.0", submittedBy: "a.novak", submittedAgo: "2 days ago", duration: "1s" },
  { id: fakeJobId(91), batchKey: fakeJobId(91), batchLabel: "—", input: "WSI-2026-70458-2.ome", status: "Failed", app: "path-analyzer", appVersion: "6.0.0", submittedBy: "a.novak", submittedAgo: "2 days ago", duration: "4h 24m" },
  { id: fakeJobId(92), batchKey: fakeJobId(92), batchLabel: "—", input: "WSI-2023-50264-2.ome", status: "Failed", app: "path-analyzer", appVersion: "6.0.0", submittedBy: "a.novak", submittedAgo: "4 days ago", duration: "1h 13m" },
];

const batchJobColumns: ColumnConfig[] = [
  { id: "batchKey", header: "Batch", size: 170, anchor: true },
  { id: "jobId", header: "Job ID", size: 230, monospace: true, ellipsis: "right", copyable: true },
  { id: "input", header: "Input", size: 220, enableSorting: true, enableColumnFilter: true, filterType: "text", filterPlaceholder: "Filter by input..." },
  { id: "status", header: "Status", size: 140, enableSorting: true },
  { id: "app", header: "App", size: 150, enableSorting: true },
  { id: "appVersion", header: "App Version", size: 120, enableSorting: true },
  { id: "submittedBy", header: "Submitted by", size: 150, enableSorting: true },
  { id: "submittedAgo", header: "Submitted", size: 130, enableSorting: true },
  { id: "duration", header: "Duration", size: 110, align: "right", enableSorting: true },
];

const statusBadgeColor = (status: string) =>
  status === "Failed" ? "rose" : status === "Running" ? "teal" : status === "Queued" ? "slate" : "green";

export const GroupedJobs: Story = {
  name: "Grouped Jobs (grouped by batch)",
  parameters: {
    docs: {
      description: {
        story:
          "Grouping by a column, the ag-grid shape: the group renders as an ordinary row in the column grid (here the batch's size and its status roll-up, from `groupCellRenderers`) and its leaf rows stay intact beneath it — the same columns, the same cells. The grouping column's cell is the expand toggle, and on a group row it also carries the batch's Relaunch action (in the Duration column, where a leaf row has a duration of its own). A job with no batch of its own (the older failures) gets its own one-row group, which the Table renders as a plain row. With `enableRowSelection`, a group row carries a tri-state checkbox that selects its whole batch.",
      },
    },
  },
  args: {
    enableRowSelection: true,
    showIndex: false,
  },
  argTypes: {
    enableRowSelection: { control: "boolean", description: "Dedicated selection column with per-row checkboxes + select-all (group rows toggle their whole batch)" },
    showIndex: { control: "boolean", description: "Line-number column" },
  },
  render: ({ enableRowSelection, showIndex }) => (
    <Table
      columns={batchJobColumns}
      data={[...batchJobs, ...olderJobs]}
      cellRenderers={{
        batchKey: (row) => row.batchLabel,
        jobId: (row) => row.id,
        input: (row) => row.input,
        status: (row) => (
          <Badge color={statusBadgeColor(row.status) as never} size="sm">
            {row.status}
          </Badge>
        ),
        app: (row) => row.app,
        appVersion: (row) => row.appVersion,
        submittedBy: (row) => row.submittedBy,
        submittedAgo: (row) => row.submittedAgo,
        duration: (row) => row.duration,
      }}
      // The group row reads across the grid: its label in the Batch column,
      // the batch's roll-up in the columns beside it.
      groupCellRenderers={{
        batchKey: (group) => <span>Batch of {group.count}</span>,
        jobId: (group) => {
          const running = group.rows.filter((r) => r.status === "Running").length;
          const queued = group.rows.filter((r) => r.status === "Queued").length;
          if (running > 0) return <span className="text-muted-foreground">{running} running</span>;
          if (queued > 0) return <span className="text-muted-foreground">{queued} queued</span>;
          return null;
        },
        status: (group) => (
          <span className="flex flex-wrap items-center gap-1">
            {(
              [
                ["Running", "teal"],
                ["Completed", "green"],
                ["Failed", "rose"],
                ["Queued", "slate"],
              ] as const
            ).map(([status, color]) => {
              const n = group.rows.filter((r) => r.status === status).length;
              return n > 0 ? (
                <Badge key={status} color={color as never} size="sm">
                  {n} {status.toLowerCase()}
                </Badge>
              ) : null;
            })}
          </span>
        ),
        app: (group) => (
          <span className="text-muted-foreground">
            {[...new Set(group.rows.map((r) => r.app))].join(", ")}
          </span>
        ),
        appVersion: (group) => (
          <span className="text-muted-foreground">
            {[...new Set(group.rows.map((r) => r.appVersion))].join(", ")}
          </span>
        ),
        submittedBy: (group) => (
          <span className="text-muted-foreground">
            {[...new Set(group.rows.map((r) => r.submittedBy))].join(", ")}
          </span>
        ),
        submittedAgo: (group) => (
          <span className="text-muted-foreground">{group.rows[0]?.submittedAgo}</span>
        ),
      }}
      tableId="storybook-jobs-grouped"
      ariaLabel="Jobs grouped by batch"
      getRowId={(row) => row.id}
      showIndex={showIndex}
      enableRowSelection={enableRowSelection}
      groupBy="batchKey"
      defaultExpandedGroups
    />
  ),
};
