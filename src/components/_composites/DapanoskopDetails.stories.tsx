import type { Meta, StoryObj } from "storybook/react";

import { Badge } from "../Badge";
import { Banner } from "../Banner";
import { Card } from "../Card";
import { Table } from "../Table";
import type { CellRenderers, ColumnConfig } from "../Table";
import { DeltaIndicator } from "../DeltaIndicator";
import { MetricCard } from "../MetricCard";
import { ProgressBar } from "../ProgressBar";
import { H2, H3 } from "../Heading";
import {
  costCenters,
  storageMetrics,
  storageTiers,
  storageTierTotal,
  tierColors,
  usageTypesDataPipeline,
  formatUsd,
  formatBytes,
  type StorageTier,
  type UsageTypeRow,
  type Workload,
} from "../../stories/dapanoskop-mock-data";

/* ------------------------------------------------------------------ */
/*  Shared table configurations                                        */
/* ------------------------------------------------------------------ */

const workloadColumns: ColumnConfig[] = [
  { id: "name", header: "Workload", size: 240, anchor: true, enableSorting: true },
  { id: "currentCostUsd", header: "Current", size: 160, align: "right", enableSorting: true, sortingFn: "basic" },
  { id: "prevMonthCostUsd", header: "vs Last Month", size: 160 },
  { id: "yoyCostUsd", header: "vs Last Year", size: 160 },
];

const workloadRenderers: CellRenderers<Workload> = {
  name: (wl) =>
    wl.name === "Untagged" ? (
      <span className="font-medium text-destructive">{wl.name}</span>
    ) : (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="text-primary hover:underline no-underline"
      >
        {wl.name}
      </a>
    ),
  currentCostUsd: (wl) => (
    <span className="tabular-nums font-medium">
      {formatUsd(wl.currentCostUsd)}
    </span>
  ),
  prevMonthCostUsd: (wl) => (
    <DeltaIndicator current={wl.currentCostUsd} previous={wl.prevMonthCostUsd} />
  ),
  yoyCostUsd: (wl) =>
    wl.yoyCostUsd > 0 ? (
      <DeltaIndicator current={wl.currentCostUsd} previous={wl.yoyCostUsd} />
    ) : (
      <span className="text-muted-foreground">N/A</span>
    ),
};

const usageTypeColumns: ColumnConfig[] = [
  { id: "usageType", header: "Usage Type", size: 240, anchor: true, enableSorting: true },
  { id: "category", header: "Category", size: 160 },
  { id: "costUsd", header: "Cost", size: 160, align: "right", enableSorting: true, sortingFn: "basic" },
];

const usageTypeRenderers: CellRenderers<UsageTypeRow> = {
  usageType: (row) => <span className="font-medium">{row.usageType}</span>,
  category: (row) => (
    <Badge color={categoryBadgeColor(row.category)} size="sm">
      {row.category}
    </Badge>
  ),
  costUsd: (row) => (
    <span className="tabular-nums font-medium">{formatUsd(row.costUsd)}</span>
  ),
};

const tierColumns: ColumnConfig[] = [
  { id: "tier", header: "Tier", size: 200, anchor: true, enableSorting: true },
  { id: "gbMonths", header: "Volume", size: 160, align: "right", enableSorting: true, sortingFn: "basic" },
  { id: "costUsd", header: "Cost", size: 160, align: "right", enableSorting: true, sortingFn: "basic" },
  { id: "pct", header: "% of Total", size: 140, align: "right" },
];

const tierRenderers: CellRenderers<StorageTier & { pct: number }> = {
  tier: (row) => (
    <span className="flex items-center gap-2">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={{
          backgroundColor:
            tierColors[row.tier] ?? "var(--color-muted-foreground)",
        }}
      />
      {row.tier}
    </span>
  ),
  gbMonths: (row) => (
    <span className="tabular-nums">
      {row.gbMonths >= 1000
        ? `${(row.gbMonths / 1000).toFixed(1)} TB`
        : `${row.gbMonths.toFixed(1)} GB`}
    </span>
  ),
  costUsd: (row) => (
    <span className="tabular-nums font-medium">{formatUsd(row.costUsd)}</span>
  ),
  pct: (row) => <span className="tabular-nums">{row.pct.toFixed(1)}%</span>,
};

/* ------------------------------------------------------------------ */
/*  Shared: Back link                                                  */
/* ------------------------------------------------------------------ */

function BackLink({ label = "Back to Report" }: { label?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="text-primary hover:underline no-underline text-sm"
    >
      &larr; {label}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared: Page shell                                                 */
/* ------------------------------------------------------------------ */

function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-card">
      <header className="bg-background border-b border-border px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
            &#x03B4;
          </span>
          <span className="text-lg font-semibold text-foreground">
            Dapanoskop
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {children}
      </main>
      <footer className="border-t border-border mt-12 py-4 text-center text-xs text-muted-foreground">
        Dapanoskop v1.2.0
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cost Center Detail                                                 */
/* ------------------------------------------------------------------ */

function CostCenterDetailPage() {
  const cc = costCenters[0]; // Engineering

  return (
    <PageShell>
      <div className="flex items-center gap-4">
        <BackLink />
        <span className="text-sm text-muted-foreground">
          January 2026
        </span>
      </div>

      <H2>{cc.name}</H2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Spend"
          value={formatUsd(cc.currentCostUsd)}
        />
        <MetricCard
          label="vs Last Month"
          value={
            <DeltaIndicator
              current={cc.currentCostUsd}
              previous={cc.prevMonthCostUsd}
            />
          }
        />
        <MetricCard
          label="vs Last Year"
          value={
            <DeltaIndicator
              current={cc.currentCostUsd}
              previous={cc.yoyCostUsd}
            />
          }
        />
      </div>

      {/* Cost trend placeholder */}
      <Card className="p-6">
        <H3>{cc.name} Cost Trend</H3>
        <div className="mt-4 h-48 flex items-center justify-center rounded-md bg-card text-muted-foreground text-sm">
          Bar chart placeholder (12-month trend for {cc.name})
        </div>
      </Card>

      {/* Workload breakdown (always visible, not expandable) */}
      <Card className="p-4">
        <H3 className="mb-4">Workload Breakdown</H3>
        <Table
          columns={workloadColumns}
          data={cc.workloads}
          cellRenderers={workloadRenderers}
          tableId="storybook-dapanoskop-cc-workloads"
          ariaLabel="Workload breakdown"
          getRowId={(wl) => wl.name}
        />
      </Card>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Workload Detail                                                    */
/* ------------------------------------------------------------------ */

function WorkloadDetailPage() {
  const wl = costCenters[0].workloads[0]; // data-pipeline

  return (
    <PageShell>
      <div className="flex items-center gap-4">
        <BackLink />
        <span className="text-sm text-muted-foreground">
          January 2026
        </span>
      </div>

      <div>
        <H2>Workload: {wl.name}</H2>
        <p className="text-sm text-muted-foreground mt-1">
          Cost Center: Engineering
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Current"
          value={formatUsd(wl.currentCostUsd)}
        />
        <MetricCard
          label="vs Last Month"
          value={
            <DeltaIndicator
              current={wl.currentCostUsd}
              previous={wl.prevMonthCostUsd}
            />
          }
        />
        <MetricCard
          label="vs Last Year"
          value={
            <DeltaIndicator
              current={wl.currentCostUsd}
              previous={wl.yoyCostUsd}
            />
          }
        />
      </div>

      {/* Usage type breakdown */}
      <Card>
        <Table
          columns={usageTypeColumns}
          data={usageTypesDataPipeline}
          cellRenderers={usageTypeRenderers}
          tableId="storybook-dapanoskop-usage-types"
          ariaLabel="Usage type breakdown"
          getRowId={(row) => row.usageType}
        />
      </Card>
    </PageShell>
  );
}

function categoryBadgeColor(category: string) {
  switch (category) {
    case "Compute":
      return "purple" as const;
    case "Storage":
      return "teal" as const;
    case "Support":
      return "slate" as const;
    default:
      return "slate" as const;
  }
}

/* ------------------------------------------------------------------ */
/*  Storage Detail                                                     */
/* ------------------------------------------------------------------ */

function StorageDetailPage() {
  return (
    <PageShell>
      <div className="flex items-center gap-4">
        <BackLink />
        <span className="text-sm text-muted-foreground">
          January 2026
        </span>
      </div>

      <div>
        <H2>Storage Volume Breakdown</H2>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution of stored data across S3 storage tiers
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Stored"
          value={
            storageMetrics.storageLensTotalBytes != null
              ? formatBytes(storageMetrics.storageLensTotalBytes)
              : "N/A"
          }
        />
        <MetricCard
          label="Hot Tier"
          value={`${storageMetrics.hotTierPercentage.toFixed(1)}%`}
        />
        <MetricCard
          label="Cost / TB"
          value={formatUsd(storageMetrics.costPerTbUsd)}
        />
      </div>

      {/* Pie chart placeholder */}
      <Card className="p-6">
        <H3>Tier Distribution by Volume</H3>
        <div className="mt-4 h-64 flex items-center justify-center rounded-md bg-card text-muted-foreground text-sm">
          Pie chart placeholder (storage tier distribution)
        </div>
      </Card>

      {/* Tier table */}
      <Card>
        <Table
          columns={tierColumns}
          data={storageTiers.map((row) => ({
            ...row,
            pct:
              storageTierTotal > 0
                ? (row.gbMonths / storageTierTotal) * 100
                : 0,
          }))}
          cellRenderers={tierRenderers}
          tableId="storybook-dapanoskop-storage-tiers"
          ariaLabel="Storage tier breakdown"
          getRowId={(row) => row.tier}
        />
      </Card>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Storage Cost Detail                                                */
/* ------------------------------------------------------------------ */

function StorageCostDetailPage() {
  return (
    <PageShell>
      <div className="flex items-center gap-4">
        <BackLink />
        <span className="text-sm text-muted-foreground">
          January 2026
        </span>
      </div>

      <div>
        <H2>Storage Cost Breakdown</H2>
        <p className="text-sm text-muted-foreground mt-1">
          All storage usage types across all workloads
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard
          label="Total Storage Cost"
          value={formatUsd(storageMetrics.totalCostUsd)}
        />
        <MetricCard
          label="vs Last Month"
          value={
            <DeltaIndicator
              current={storageMetrics.totalCostUsd}
              previous={storageMetrics.prevMonthCostUsd}
            />
          }
        />
      </div>

      {/* Placeholder for the full usage type table */}
      <Card className="p-6">
        <div className="h-48 flex items-center justify-center rounded-md bg-card text-muted-foreground text-sm">
          Usage type table placeholder (all storage usage types across workloads)
        </div>
      </Card>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Not Found state                                                    */
/* ------------------------------------------------------------------ */

function CostCenterNotFound() {
  return (
    <PageShell>
      <BackLink />
      <Banner variant="warning">
        Cost center &ldquo;Unknown Center&rdquo; not found in the selected period.
      </Banner>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Dapanoskop Details",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** Cost Center Detail page showing Engineering cost center with workload breakdown. */
export const CostCenterDetail: Story = {
  name: "Cost Center Detail",
  render: () => <CostCenterDetailPage />,
};

/** Workload Detail page showing usage type breakdown for the data-pipeline workload. */
export const WorkloadDetail: Story = {
  name: "Workload Detail",
  render: () => <WorkloadDetailPage />,
};

/** Storage Detail page showing tier distribution. */
export const StorageVolumeDetail: Story = {
  name: "Storage Volume Detail",
  render: () => <StorageDetailPage />,
};

/** Storage Cost Detail page showing cost breakdown by storage usage type. */
export const StorageCostDetail: Story = {
  name: "Storage Cost Detail",
  render: () => <StorageCostDetailPage />,
};

/** Warning state when a cost center is not found in the selected period. */
export const NotFound: Story = {
  name: "Cost Center Not Found",
  render: () => <CostCenterNotFound />,
};
