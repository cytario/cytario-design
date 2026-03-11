import type { Meta, StoryObj } from "storybook/react";

import { Badge } from "../Badge";
import { Banner } from "../Banner";
import { Card } from "../Card";
import { DeltaIndicator } from "../DeltaIndicator";
import { MetricCard } from "../MetricCard";
import { ProgressBar } from "../ProgressBar";
import { H2, H3 } from "../Heading";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../Table";
import {
  costCenters,
  storageMetrics,
  storageTiers,
  storageTierTotal,
  tierColors,
  usageTypesDataPipeline,
  formatUsd,
  formatBytes,
} from "../../stories/dapanoskop-mock-data";

/* ------------------------------------------------------------------ */
/*  Shared: Back link                                                  */
/* ------------------------------------------------------------------ */

function BackLink({ label = "Back to Report" }: { label?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="text-(--color-brand-primary) hover:underline no-underline text-sm"
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
    <div className="min-h-screen bg-(--color-surface-subtle)">
      <header className="bg-(--color-surface-default) border-b border-(--color-border-default) px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-xl font-bold text-(--color-text-primary)">
            &#x03B4;
          </span>
          <span className="text-lg font-semibold text-(--color-text-primary)">
            Dapanoskop
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {children}
      </main>
      <footer className="border-t border-(--color-border-default) mt-12 py-4 text-center text-xs text-(--color-text-tertiary)">
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
        <span className="text-sm text-(--color-text-secondary)">
          January 2026
        </span>
      </div>

      <H2 weight="bold">{cc.name}</H2>

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
      <Card padding="lg">
        <H3>{cc.name} Cost Trend</H3>
        <div className="mt-4 h-48 flex items-center justify-center rounded-md bg-(--color-surface-subtle) text-(--color-text-tertiary) text-sm">
          Bar chart placeholder (12-month trend for {cc.name})
        </div>
      </Card>

      {/* Workload breakdown (always visible, not expandable) */}
      <Card padding="md">
        <H3 className="mb-4">Workload Breakdown</H3>
        <Table size="compact" aria-label="Workload breakdown">
          <TableHeader>
            <Column isRowHeader>Workload</Column>
            <Column>Current</Column>
            <Column>vs Last Month</Column>
            <Column>vs Last Year</Column>
          </TableHeader>
          <TableBody>
            {cc.workloads.map((wl) => {
              const isUntagged = wl.name === "Untagged";
              return (
                <Row key={wl.name}>
                  <Cell>
                    {isUntagged ? (
                      <span className="font-medium text-(--color-text-danger)">
                        {wl.name}
                      </span>
                    ) : (
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="text-(--color-brand-primary) hover:underline no-underline"
                      >
                        {wl.name}
                      </a>
                    )}
                  </Cell>
                  <Cell>
                    <span className="tabular-nums font-medium">
                      {formatUsd(wl.currentCostUsd)}
                    </span>
                  </Cell>
                  <Cell>
                    <DeltaIndicator
                      current={wl.currentCostUsd}
                      previous={wl.prevMonthCostUsd}
                    />
                  </Cell>
                  <Cell>
                    {wl.yoyCostUsd > 0 ? (
                      <DeltaIndicator
                        current={wl.currentCostUsd}
                        previous={wl.yoyCostUsd}
                      />
                    ) : (
                      <span className="text-(--color-text-tertiary)">N/A</span>
                    )}
                  </Cell>
                </Row>
              );
            })}
          </TableBody>
        </Table>
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
        <span className="text-sm text-(--color-text-secondary)">
          January 2026
        </span>
      </div>

      <div>
        <H2 weight="bold">Workload: {wl.name}</H2>
        <p className="text-sm text-(--color-text-secondary) mt-1">
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
      <Card padding="none">
        <Table size="comfortable" aria-label="Usage type breakdown">
          <TableHeader>
            <Column isRowHeader>Usage Type</Column>
            <Column>Category</Column>
            <Column>Cost</Column>
          </TableHeader>
          <TableBody>
            {usageTypesDataPipeline.map((row) => (
              <Row key={row.usageType}>
                <Cell>
                  <span className="font-medium">
                    {row.usageType}
                  </span>
                </Cell>
                <Cell>
                  <Badge
                    variant={categoryBadgeVariant(row.category)}
                    size="sm"
                  >
                    {row.category}
                  </Badge>
                </Cell>
                <Cell>
                  <span className="tabular-nums font-medium">
                    {formatUsd(row.costUsd)}
                  </span>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Card>
    </PageShell>
  );
}

function categoryBadgeVariant(category: string) {
  switch (category) {
    case "Compute":
      return "purple" as const;
    case "Storage":
      return "teal" as const;
    case "Support":
      return "slate" as const;
    default:
      return "neutral" as const;
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
        <span className="text-sm text-(--color-text-secondary)">
          January 2026
        </span>
      </div>

      <div>
        <H2 weight="bold">Storage Volume Breakdown</H2>
        <p className="text-sm text-(--color-text-secondary) mt-1">
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
      <Card padding="lg">
        <H3>Tier Distribution by Volume</H3>
        <div className="mt-4 h-64 flex items-center justify-center rounded-md bg-(--color-surface-subtle) text-(--color-text-tertiary) text-sm">
          Pie chart placeholder (storage tier distribution)
        </div>
      </Card>

      {/* Tier table */}
      <Card padding="none">
        <Table size="comfortable" aria-label="Storage tier breakdown">
          <TableHeader>
            <Column isRowHeader>Tier</Column>
            <Column>Volume</Column>
            <Column>Cost</Column>
            <Column>% of Total</Column>
          </TableHeader>
          <TableBody>
            {storageTiers.map((row) => {
              const pct =
                storageTierTotal > 0
                  ? (row.gbMonths / storageTierTotal) * 100
                  : 0;
              return (
                <Row key={row.tier}>
                  <Cell>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            tierColors[row.tier] ?? "var(--color-text-secondary)",
                        }}
                      />
                      {row.tier}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="tabular-nums">
                      {row.gbMonths >= 1000
                        ? `${(row.gbMonths / 1000).toFixed(1)} TB`
                        : `${row.gbMonths.toFixed(1)} GB`}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="tabular-nums font-medium">
                      {formatUsd(row.costUsd)}
                    </span>
                  </Cell>
                  <Cell>
                    <span className="tabular-nums">{pct.toFixed(1)}%</span>
                  </Cell>
                </Row>
              );
            })}
          </TableBody>
        </Table>
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
        <span className="text-sm text-(--color-text-secondary)">
          January 2026
        </span>
      </div>

      <div>
        <H2 weight="bold">Storage Cost Breakdown</H2>
        <p className="text-sm text-(--color-text-secondary) mt-1">
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
      <Card padding="lg">
        <div className="h-48 flex items-center justify-center rounded-md bg-(--color-surface-subtle) text-(--color-text-tertiary) text-sm">
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
