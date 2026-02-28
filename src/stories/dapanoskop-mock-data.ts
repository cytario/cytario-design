/**
 * Mock data for dapanoskop composite Storybook stories.
 *
 * These structures mirror the dapanoskop CostSummary data model
 * (see dapanoskop/app/app/types/cost-data.ts) but are simplified
 * to only the fields the cytario-design components need for rendering.
 *
 * All cost figures are realistic but fictional.
 */

/* ------------------------------------------------------------------ */
/*  Domain types (subset of dapanoskop's cost-data.ts)                 */
/* ------------------------------------------------------------------ */

export interface Workload {
  name: string;
  currentCostUsd: number;
  prevMonthCostUsd: number;
  yoyCostUsd: number;
}

export interface CostCenter {
  name: string;
  currentCostUsd: number;
  prevMonthCostUsd: number;
  yoyCostUsd: number;
  workloads: Workload[];
  isSplitCharge?: boolean;
}

export interface StorageMetrics {
  totalCostUsd: number;
  prevMonthCostUsd: number;
  costPerTbUsd: number;
  hotTierPercentage: number;
  storageLensTotalBytes?: number;
}

export interface TaggingCoverage {
  taggedCostUsd: number;
  untaggedCostUsd: number;
  taggedPercentage: number;
}

export interface StorageTier {
  tier: string;
  gbMonths: number;
  costUsd: number;
}

export interface UsageTypeRow {
  usageType: string;
  category: "Storage" | "Compute" | "Other" | "Support";
  costUsd: number;
}

/* ------------------------------------------------------------------ */
/*  Format helpers (matching dapanoskop's format.ts patterns)           */
/* ------------------------------------------------------------------ */

const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number): string {
  return usdFormat.format(value);
}

export function formatBytes(bytes: number): string {
  const pb = bytes / 1_125_899_906_842_624;
  if (pb >= 1) return `${pb.toFixed(1)} PB`;
  const tb = bytes / 1_099_511_627_776;
  if (tb >= 1) return `${tb.toFixed(1)} TB`;
  const gb = bytes / 1_073_741_824;
  return `${gb.toFixed(1)} GB`;
}

/* ------------------------------------------------------------------ */
/*  Mock cost centers and workloads                                    */
/* ------------------------------------------------------------------ */

export const workloadsEngineering: Workload[] = [
  {
    name: "data-pipeline",
    currentCostUsd: 5200,
    prevMonthCostUsd: 4800,
    yoyCostUsd: 3200,
  },
  {
    name: "web-app",
    currentCostUsd: 3100,
    prevMonthCostUsd: 2900,
    yoyCostUsd: 2500,
  },
  {
    name: "ml-training",
    currentCostUsd: 2800,
    prevMonthCostUsd: 2600,
    yoyCostUsd: 1800,
  },
  {
    name: "ci-cd",
    currentCostUsd: 1200,
    prevMonthCostUsd: 1300,
    yoyCostUsd: 900,
  },
  {
    name: "monitoring",
    currentCostUsd: 800,
    prevMonthCostUsd: 750,
    yoyCostUsd: 600,
  },
  {
    name: "Untagged",
    currentCostUsd: 900,
    prevMonthCostUsd: 850,
    yoyCostUsd: 500,
  },
];

export const workloadsResearch: Workload[] = [
  {
    name: "image-analysis",
    currentCostUsd: 3800,
    prevMonthCostUsd: 3200,
    yoyCostUsd: 2100,
  },
  {
    name: "storage-archive",
    currentCostUsd: 2400,
    prevMonthCostUsd: 2300,
    yoyCostUsd: 1800,
  },
  {
    name: "batch-processing",
    currentCostUsd: 1200,
    prevMonthCostUsd: 1500,
    yoyCostUsd: 900,
  },
];

export const costCenters: CostCenter[] = [
  {
    name: "Engineering",
    currentCostUsd: 14000,
    prevMonthCostUsd: 13200,
    yoyCostUsd: 9500,
    workloads: workloadsEngineering,
  },
  {
    name: "Research",
    currentCostUsd: 7400,
    prevMonthCostUsd: 7000,
    yoyCostUsd: 4800,
    workloads: workloadsResearch,
  },
  {
    name: "Shared Services",
    currentCostUsd: 2200,
    prevMonthCostUsd: 2100,
    yoyCostUsd: 1700,
    workloads: [
      {
        name: "dns-networking",
        currentCostUsd: 1400,
        prevMonthCostUsd: 1300,
        yoyCostUsd: 1100,
      },
      {
        name: "security-tools",
        currentCostUsd: 800,
        prevMonthCostUsd: 800,
        yoyCostUsd: 600,
      },
    ],
  },
  {
    name: "Platform Overhead",
    currentCostUsd: 1800,
    prevMonthCostUsd: 1600,
    yoyCostUsd: 0,
    workloads: [],
    isSplitCharge: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Aggregate computed values (for the global summary)                 */
/* ------------------------------------------------------------------ */

const activeCenters = costCenters.filter((cc) => !cc.isSplitCharge);

export const globalTotalCurrent = activeCenters.reduce(
  (sum, cc) => sum + cc.currentCostUsd,
  0,
);
export const globalTotalPrev = activeCenters.reduce(
  (sum, cc) => sum + cc.prevMonthCostUsd,
  0,
);
export const globalTotalYoy = activeCenters.reduce(
  (sum, cc) => sum + cc.yoyCostUsd,
  0,
);

/* ------------------------------------------------------------------ */
/*  Mock storage metrics                                               */
/* ------------------------------------------------------------------ */

export const storageMetrics: StorageMetrics = {
  totalCostUsd: 1234.56,
  prevMonthCostUsd: 1084.56,
  costPerTbUsd: 23.33,
  hotTierPercentage: 62.3,
  storageLensTotalBytes: 5 * 1_099_511_627_776, // 5.0 TB
};

export const storageMetricsWithoutLens: StorageMetrics = {
  ...storageMetrics,
  storageLensTotalBytes: undefined,
};

/* ------------------------------------------------------------------ */
/*  Mock tagging coverage                                              */
/* ------------------------------------------------------------------ */

export const taggingCoverage: TaggingCoverage = {
  taggedCostUsd: 21200,
  untaggedCostUsd: 2400,
  taggedPercentage: 89.8,
};

/* ------------------------------------------------------------------ */
/*  Mock storage tier data (for Storage Detail screen)                 */
/* ------------------------------------------------------------------ */

export const storageTiers: StorageTier[] = [
  { tier: "S3 Standard", gbMonths: 2800, costUsd: 680 },
  { tier: "IT Frequent Access", gbMonths: 1200, costUsd: 290 },
  { tier: "IT Infrequent Access", gbMonths: 600, costUsd: 75 },
  { tier: "Glacier Instant", gbMonths: 300, costUsd: 42 },
  { tier: "Glacier Flexible", gbMonths: 150, costUsd: 8.5 },
  { tier: "Glacier Deep Archive", gbMonths: 80, costUsd: 1.2 },
];

export const storageTierTotal = storageTiers.reduce(
  (sum, t) => sum + t.gbMonths,
  0,
);

/* ------------------------------------------------------------------ */
/*  Mock usage type data (for Workload Detail screen)                  */
/* ------------------------------------------------------------------ */

export const usageTypesDataPipeline: UsageTypeRow[] = [
  { usageType: "EC2 - Running Hours (m5.2xlarge)", category: "Compute", costUsd: 2100 },
  { usageType: "S3 - TimedStorage-ByteHrs", category: "Storage", costUsd: 1400 },
  { usageType: "S3 - Requests-Tier1", category: "Other", costUsd: 680 },
  { usageType: "EC2 - EBS:VolumeUsage.gp3", category: "Storage", costUsd: 520 },
  { usageType: "CloudWatch - MetricMonitorUsage", category: "Support", costUsd: 280 },
  { usageType: "DataTransfer - Out-Bytes", category: "Other", costUsd: 220 },
];

/* ------------------------------------------------------------------ */
/*  Mock period data                                                   */
/* ------------------------------------------------------------------ */

export const periods = [
  "2026-02", // MTD (current month)
  "2026-01",
  "2025-12",
  "2025-11",
  "2025-10",
  "2025-09",
  "2025-08",
  "2025-07",
  "2025-06",
  "2025-05",
  "2025-04",
  "2025-03",
  "2025-02",
];

export const selectedPeriod = "2026-01"; // Default: most recent completed month
export const currentMonth = "2026-02";

/* ------------------------------------------------------------------ */
/*  MTD-specific mock data                                             */
/* ------------------------------------------------------------------ */

export const mtdComparison = {
  priorPartialStart: "2026-01-01",
  priorPartialEndExclusive: "2026-01-08",
  costCenters: [
    {
      name: "Engineering",
      priorPartialCostUsd: 3500,
      workloads: [
        { name: "data-pipeline", priorPartialCostUsd: 1400 },
        { name: "web-app", priorPartialCostUsd: 800 },
        { name: "ml-training", priorPartialCostUsd: 700 },
        { name: "ci-cd", priorPartialCostUsd: 300 },
        { name: "monitoring", priorPartialCostUsd: 200 },
        { name: "Untagged", priorPartialCostUsd: 100 },
      ],
    },
    {
      name: "Research",
      priorPartialCostUsd: 1800,
      workloads: [
        { name: "image-analysis", priorPartialCostUsd: 900 },
        { name: "storage-archive", priorPartialCostUsd: 600 },
        { name: "batch-processing", priorPartialCostUsd: 300 },
      ],
    },
    {
      name: "Shared Services",
      priorPartialCostUsd: 550,
      workloads: [
        { name: "dns-networking", priorPartialCostUsd: 350 },
        { name: "security-tools", priorPartialCostUsd: 200 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Cost trend data points (for CostTrendChart mock)                   */
/* ------------------------------------------------------------------ */

export interface TrendPoint {
  period: string;
  [costCenterName: string]: string | number;
}

export const trendData: TrendPoint[] = [
  { period: "2025-02", Engineering: 9500, Research: 4200, "Shared Services": 1500 },
  { period: "2025-03", Engineering: 10200, Research: 4500, "Shared Services": 1550 },
  { period: "2025-04", Engineering: 10800, Research: 4800, "Shared Services": 1600 },
  { period: "2025-05", Engineering: 11100, Research: 5100, "Shared Services": 1650 },
  { period: "2025-06", Engineering: 11500, Research: 5400, "Shared Services": 1700 },
  { period: "2025-07", Engineering: 11800, Research: 5600, "Shared Services": 1750 },
  { period: "2025-08", Engineering: 12200, Research: 5900, "Shared Services": 1800 },
  { period: "2025-09", Engineering: 12500, Research: 6200, "Shared Services": 1850 },
  { period: "2025-10", Engineering: 12800, Research: 6500, "Shared Services": 1900 },
  { period: "2025-11", Engineering: 13000, Research: 6700, "Shared Services": 1950 },
  { period: "2025-12", Engineering: 13200, Research: 7000, "Shared Services": 2100 },
  { period: "2026-01", Engineering: 14000, Research: 7400, "Shared Services": 2200 },
];

/** Single cost center trend data (for Cost Center Detail screen) */
export const engineeringTrendData: TrendPoint[] = trendData.map((p) => ({
  period: p.period,
  Engineering: p.Engineering,
}));

/* ------------------------------------------------------------------ */
/*  Tier color palette (for Storage Detail pie chart mock)             */
/* ------------------------------------------------------------------ */

export const tierColors: Record<string, string> = {
  "S3 Standard": "#ef4444",
  "IT Frequent Access": "#f97316",
  "Glacier Instant": "#eab308",
  "IT Infrequent Access": "#22c55e",
  "One Zone-IA": "#14b8a6",
  "IT Archive Instant": "#3b82f6",
  "Glacier Flexible": "#8b5cf6",
  "IT Deep Archive": "#6366f1",
  "Glacier Deep Archive": "#1e3a5f",
};
