import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "../Badge";
import { DataTable, type CellRenderers, type ColumnConfig } from "./DataTable";

interface Job {
  application: string;
  status: string;
  submittedBy: string;
  submittedAt: string;
}

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

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
    application: "tissue-classifier : 1.1.2",
    status: "Running",
    submittedBy: "jdoe",
    submittedAt: "2026-09-08T09:41:00Z",
  },
  {
    application: "cell-segmentation : 2.0.0",
    status: "Completed",
    submittedBy: "asmith",
    submittedAt: "2026-09-07T15:02:00Z",
  },
  {
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
    <DataTable
      columns={columns}
      data={data}
      cellRenderers={cellRenderers}
      tableId="storybook-jobs"
      ariaLabel="Jobs"
    />
  ),
};
