import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";

import { Badge } from "../Badge";
import { Banner } from "../Banner";
import { Card } from "../Card";
import { DeltaIndicator } from "../DeltaIndicator";
import { MetricCard } from "../MetricCard";
import { ProgressBar } from "../ProgressBar";
import { H1, H3 } from "../Heading";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../Table";
import {
  type CostCenter,
  type Workload,
  costCenters,
  globalTotalCurrent,
  globalTotalPrev,
  globalTotalYoy,
  storageMetrics,
  taggingCoverage,
  formatUsd,
  formatBytes,
} from "../../stories/dapanoskop-mock-data";

/* ------------------------------------------------------------------ */
/*  Period selector (story-local, lightweight)                         */
/* ------------------------------------------------------------------ */

function PeriodStrip({
  periods,
  selected,
  onSelect,
  currentMonth,
}: {
  periods: string[];
  selected: string;
  onSelect: (p: string) => void;
  currentMonth: string;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1" role="tablist" aria-label="Reporting period">
      {periods.map((p) => {
        const isMtd = p === currentMonth;
        const isSelected = p === selected;
        const label = formatPeriodLabel(p);
        return (
          <button
            key={p}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(p)}
            className={[
              "shrink-0 rounded-[var(--border-radius-md)] px-3 py-1.5 text-[length:var(--font-size-sm)] transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
              isSelected
                ? "bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] font-[number:var(--font-weight-medium)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]",
            ].join(" ")}
          >
            {label}
            {isMtd && (
              <Badge variant="amber" size="sm" className="ml-1.5">
                MTD
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

/* ------------------------------------------------------------------ */
/*  Workload table (story-local)                                       */
/* ------------------------------------------------------------------ */

function WorkloadBreakdown({
  workloads,
}: {
  workloads: Workload[];
}) {
  return (
    <Table size="compact" aria-label="Workload breakdown">
      <TableHeader>
        <Column isRowHeader>Workload</Column>
        <Column>Current</Column>
        <Column>vs Last Month</Column>
        <Column>vs Last Year</Column>
      </TableHeader>
      <TableBody>
        {workloads.map((wl) => {
          const isUntagged = wl.name === "Untagged";
          return (
            <Row key={wl.name}>
              <Cell>
                {isUntagged ? (
                  <span className="font-[number:var(--font-weight-medium)] text-[var(--color-text-danger)]">
                    {wl.name}
                  </span>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-[var(--color-brand-primary)] hover:underline no-underline"
                  >
                    {wl.name}
                  </a>
                )}
              </Cell>
              <Cell>
                <span className="tabular-nums font-[number:var(--font-weight-medium)]">
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
                  <span className="text-[var(--color-text-tertiary)]">N/A</span>
                )}
              </Cell>
            </Row>
          );
        })}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Cost center card (story-local composition)                         */
/* ------------------------------------------------------------------ */

function CostCenterSummaryCard({ cc }: { cc: CostCenter }) {
  const [expanded, setExpanded] = useState(false);

  // Find top mover
  const topMover =
    cc.workloads.length > 0
      ? cc.workloads.reduce(
          (best, wl) => {
            const delta = Math.abs(wl.currentCostUsd - wl.prevMonthCostUsd);
            return delta > best.delta ? { name: wl.name, delta, wl } : best;
          },
          { name: "", delta: 0, wl: cc.workloads[0] },
        )
      : null;

  return (
    <Card padding="none">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {cc.workloads.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="rounded-[var(--border-radius-sm)] p-0.5 hover:bg-[var(--color-surface-hover)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
                aria-label={expanded ? "Collapse" : "Expand"}
                aria-expanded={expanded}
              >
                <span
                  className={`inline-block transition-transform text-[var(--color-text-secondary)] ${expanded ? "rotate-90" : ""}`}
                >
                  &#9654;
                </span>
              </button>
            )}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="font-[number:var(--font-weight-semibold)] text-[length:var(--font-size-lg)] text-[var(--color-brand-primary)] hover:underline no-underline"
            >
              {cc.name}
            </a>
            {cc.isSplitCharge && (
              <Badge variant="slate">Split Charge</Badge>
            )}
          </div>
          <span className="text-[length:var(--font-size-xl)] font-[number:var(--font-weight-semibold)] tabular-nums">
            {cc.isSplitCharge ? (
              <span className="text-[length:var(--font-size-sm)] font-[number:var(--font-weight-normal)] text-[var(--color-text-tertiary)]">
                Allocated
              </span>
            ) : (
              formatUsd(cc.currentCostUsd)
            )}
          </span>
        </div>

        {/* Delta row */}
        {!cc.isSplitCharge && (
          <div className="flex items-center gap-6 mt-2 ml-7 text-[length:var(--font-size-sm)]">
            <DeltaIndicator
              current={cc.currentCostUsd}
              previous={cc.prevMonthCostUsd}
              label="MoM"
            />
            {cc.yoyCostUsd > 0 ? (
              <DeltaIndicator
                current={cc.currentCostUsd}
                previous={cc.yoyCostUsd}
                label="YoY"
              />
            ) : (
              <DeltaIndicator
                current={0}
                previous={0}
                label="YoY"
                unavailable
              />
            )}
          </div>
        )}

        {/* Meta row */}
        {!cc.isSplitCharge && (
          <div className="flex items-center gap-3 mt-1 ml-7 text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]">
            <span>{cc.workloads.length} workloads</span>
            {topMover && topMover.name && (
              <span>
                Top mover: {topMover.name}{" "}
                <DeltaIndicator
                  current={topMover.wl.currentCostUsd}
                  previous={topMover.wl.prevMonthCostUsd}
                  format="percentage"
                  className="text-[length:var(--font-size-xs)]"
                />
              </span>
            )}
          </div>
        )}

        {cc.isSplitCharge && (
          <div className="mt-2 ml-7 text-[length:var(--font-size-sm)] text-[var(--color-text-tertiary)]">
            Costs allocated to other cost centers
          </div>
        )}
      </div>

      {/* Expanded workload table */}
      {expanded && cc.workloads.length > 0 && (
        <div className="px-4 pb-4 border-t border-[var(--color-border-default)]">
          <div className="pt-3">
            <WorkloadBreakdown workloads={cc.workloads} />
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Full Dashboard composition                                         */
/* ------------------------------------------------------------------ */

const allPeriods = [
  "2026-02", "2026-01", "2025-12", "2025-11", "2025-10",
  "2025-09", "2025-08", "2025-07", "2025-06", "2025-05",
  "2025-04", "2025-03", "2025-02",
];

function DashboardPage({ showMtdBanner = false }: { showMtdBanner?: boolean }) {
  const [period, setPeriod] = useState(showMtdBanner ? "2026-02" : "2026-01");

  const isMtd = period === "2026-02";

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Header */}
      <header className="bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[length:var(--font-size-xl)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)]">
              &#x03B4;
            </span>
            <span className="text-[length:var(--font-size-lg)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
              Dapanoskop
            </span>
          </div>
          <span className="text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
            Cost Report
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Period selector */}
        <PeriodStrip
          periods={allPeriods}
          selected={period}
          onSelect={setPeriod}
          currentMonth="2026-02"
        />

        {/* MTD Banner */}
        {isMtd && (
          <Banner variant="warning" title="Month-to-date">
            Data through Feb 7. Figures will change as the month progresses.
            Comparisons are against Jan 1{"\u2013"}7 of the prior month.
          </Banner>
        )}

        {/* Global Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Total Spend"
            value={formatUsd(globalTotalCurrent)}
          />
          <MetricCard
            label="vs Last Month"
            value={
              <DeltaIndicator
                current={globalTotalCurrent}
                previous={globalTotalPrev}
              />
            }
          />
          <MetricCard
            label="vs Last Year"
            value={
              isMtd ? (
                <DeltaIndicator
                  current={0}
                  previous={0}
                  unavailable
                  unavailableText="N/A (MTD)"
                />
              ) : (
                <DeltaIndicator
                  current={globalTotalCurrent}
                  previous={globalTotalYoy}
                />
              )
            }
          />
        </div>

        {/* Cost Trend placeholder */}
        <Card padding="lg">
          <H3>Cost Trend</H3>
          <div className="mt-4 h-48 flex items-center justify-center rounded-[var(--border-radius-md)] bg-[var(--color-surface-subtle)] text-[var(--color-text-tertiary)] text-[length:var(--font-size-sm)]">
            Stacked bar chart placeholder (12-month trend by cost center)
          </div>
        </Card>

        {/* Storage Overview */}
        <div className={`grid grid-cols-1 ${storageMetrics.storageLensTotalBytes != null ? "sm:grid-cols-4" : "sm:grid-cols-3"} gap-4`}>
          <MetricCard
            label="Storage Cost"
            value={formatUsd(storageMetrics.totalCostUsd)}
            secondary={
              <DeltaIndicator
                current={storageMetrics.totalCostUsd}
                previous={storageMetrics.prevMonthCostUsd}
              />
            }
            href="#storage-cost"
          />
          {storageMetrics.storageLensTotalBytes != null && (
            <MetricCard
              label="Total Stored"
              value={formatBytes(storageMetrics.storageLensTotalBytes)}
              href="#storage-detail"
            />
          )}
          <MetricCard
            label="Cost / TB"
            value={formatUsd(storageMetrics.costPerTbUsd)}
          />
          <MetricCard
            label="Hot Tier"
            value={`${storageMetrics.hotTierPercentage.toFixed(1)}%`}
          />
        </div>

        {/* Tagging Coverage */}
        <Card padding="md">
          <ProgressBar
            value={taggingCoverage.taggedPercentage}
            label="Tagging Coverage"
            description={`${taggingCoverage.taggedPercentage}% tagged (${formatUsd(taggingCoverage.taggedCostUsd)}) \u00B7 ${formatUsd(taggingCoverage.untaggedCostUsd)} untagged`}
            variant="brand"
          />
        </Card>

        {/* Cost Center Cards */}
        <div className="space-y-3">
          {costCenters.map((cc) => (
            <CostCenterSummaryCard key={cc.name} cc={cc} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-default)] mt-12 py-4 text-center text-[length:var(--font-size-xs)] text-[var(--color-text-tertiary)]">
        Dapanoskop v1.2.0
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

function DashboardError() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <header className="bg-[var(--color-surface-default)] border-b border-[var(--color-border-default)] px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-[length:var(--font-size-xl)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)]">
            &#x03B4;
          </span>
          <span className="text-[length:var(--font-size-lg)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Dapanoskop
          </span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        <Banner variant="danger">
          Failed to load data for 2026-01. Please try again later.
        </Banner>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Dapanoskop Dashboard",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** The full Dashboard with completed-month data. Cost center cards are expandable. */
export const Default: Story = {
  render: () => <DashboardPage />,
};

/** Dashboard with the MTD period selected, showing the warning banner and suppressed YoY. */
export const MonthToDate: Story = {
  name: "Month-to-Date",
  render: () => <DashboardPage showMtdBanner />,
};

/** Dashboard in an error state with no data loaded. */
export const Error: Story = {
  render: () => <DashboardError />,
};
