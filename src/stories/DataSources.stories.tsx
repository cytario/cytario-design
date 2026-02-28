import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { Database, Grid3x3, LayoutGrid, List, Plus, Info } from "lucide-react";
import { StorageConnectionCard } from "../components/StorageConnectionCard";
import { Button } from "../components/Button";
import { H1, H2 } from "../components/Heading";
import { EmptyState } from "../components/EmptyState";
import { IconButton } from "../components/IconButton";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../components/SegmentedControl";

/* ------------------------------------------------------------------ */
/*  Mock tissue preview (fluorescence-like CSS gradient)               */
/* ------------------------------------------------------------------ */

const tissueGradient = [
  "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
  "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
  "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
  "radial-gradient(ellipse 60px 80px at 20% 70%, rgba(70, 130, 230, 0.35) 0%, transparent 70%)",
  "radial-gradient(ellipse 100px 60px at 40% 45%, rgba(230, 130, 50, 0.3) 0%, transparent 70%)",
  "radial-gradient(ellipse 70px 90px at 60% 55%, rgba(230, 130, 50, 0.2) 0%, transparent 65%)",
  "radial-gradient(ellipse 90px 110px at 45% 50%, rgba(80, 200, 80, 0.2) 0%, transparent 65%)",
  "radial-gradient(ellipse 60px 70px at 25% 35%, rgba(80, 200, 80, 0.15) 0%, transparent 60%)",
  "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
  "radial-gradient(circle 20px at 35% 55%, rgba(200, 60, 60, 0.25) 0%, transparent 80%)",
  "radial-gradient(circle 25px at 65% 65%, rgba(200, 60, 60, 0.3) 0%, transparent 80%)",
].join(", ");

function MockTissuePreview() {
  return (
    <div
      className="h-full w-full"
      style={{ backgroundColor: "#000000", backgroundImage: tissueGradient }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Data for stories                                                   */
/* ------------------------------------------------------------------ */

interface ConnectionData {
  id: string;
  name: string;
  region?: string;
  imageCount?: number;
  href?: string;
  hasPreview?: boolean;
}

const connections: ConnectionData[] = [
  {
    id: "1",
    name: "cytario-research-data",
    region: "eu-central-1",
    imageCount: 24,
    href: "/buckets/cytario-research-data",
    hasPreview: true,
  },
  {
    id: "2",
    name: "pathology-archive",
    region: "eu-central-1",
    imageCount: 156,
    href: "/buckets/pathology-archive",
  },
  {
    id: "3",
    name: "tissue-samples-2024",
    region: "us-east-1",
    imageCount: 312,
    href: "/buckets/tissue-samples-2024",
    hasPreview: true,
  },
  {
    id: "4",
    name: "spatial-biology-cohort",
    region: "eu-west-1",
    imageCount: 89,
    href: "/buckets/spatial-biology-cohort",
  },
];

const recentlyViewed: ConnectionData[] = [
  {
    id: "5",
    name: "sample_001.ome.tif",
    region: "eu-central-1",
    href: "/buckets/cytario-research-data/sample_001.ome.tif",
    hasPreview: true,
  },
  {
    id: "6",
    name: "tissue_section_42.ome.tif",
    region: "eu-central-1",
    href: "/buckets/cytario-research-data/tissue_section_42.ome.tif",
    hasPreview: true,
  },
];

type ViewMode = "grid-lg" | "grid-sm" | "table";

/* ------------------------------------------------------------------ */
/*  Grid view                                                          */
/* ------------------------------------------------------------------ */

function ConnectionGrid({
  data,
  size,
}: {
  data: ConnectionData[];
  size: "lg" | "sm";
}) {
  const gridClass =
    size === "lg"
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={gridClass}>
      {data.map((conn) => (
        <StorageConnectionCard
          key={conn.id}
          name={conn.name}
          imageCount={conn.imageCount}
          href={conn.href}
          onInfo={fn()}
        >
          {conn.hasPreview && <MockTissuePreview />}
        </StorageConnectionCard>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Table view                                                         */
/* ------------------------------------------------------------------ */

function ConnectionTable({ data }: { data: ConnectionData[] }) {
  return (
    <Table size="comfortable" aria-label="Data sources">
      <TableHeader>
        <Column isRowHeader>Name</Column>
        <Column>Region</Column>
        <Column>Images</Column>
        <Column>Actions</Column>
      </TableHeader>
      <TableBody>
        {data.map((conn) => (
          <Row key={conn.id}>
            <Cell>
              <span className="font-medium text-[var(--color-text-primary)]">
                {conn.name}
              </span>
            </Cell>
            <Cell>
              <span className="text-[var(--color-text-secondary)]">
                {conn.region ?? "\u2014"}
              </span>
            </Cell>
            <Cell>
              {conn.imageCount != null ? (
                <span className="tabular-nums text-[var(--color-text-tertiary)]">
                  {conn.imageCount}
                </span>
              ) : (
                <span className="text-[var(--color-text-tertiary)]">
                  &mdash;
                </span>
              )}
            </Cell>
            <Cell>
              <IconButton
                icon={Info}
                aria-label="Connection info"
                variant="ghost"
                size="sm"
                onPress={fn()}
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition: Data Sources page                                     */
/* ------------------------------------------------------------------ */

function DataSourcesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-lg");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <H1>Your Data Sources</H1>
        <Button variant="secondary" iconLeft={Plus}>
          Connect Storage
        </Button>
      </div>

      {/* View mode toolbar */}
      <div className="mb-6 flex justify-end">
        <SegmentedControl
          selectedKeys={new Set([viewMode])}
          onSelectionChange={(keys) => {
            const key = [...keys][0];
            if (key) setViewMode(key as ViewMode);
          }}
          selectionMode="single"
          size="sm"
          aria-label="View mode"
        >
          <SegmentedControlItem id="grid-lg" aria-label="Large grid">
            <LayoutGrid size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="grid-sm" aria-label="Small grid">
            <Grid3x3 size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="table" aria-label="Table view">
            <List size={16} />
          </SegmentedControlItem>
        </SegmentedControl>
      </div>

      {/* Storage connections */}
      {viewMode === "table" ? (
        <ConnectionTable data={connections} />
      ) : (
        <ConnectionGrid
          data={connections}
          size={viewMode === "grid-lg" ? "lg" : "sm"}
        />
      )}

      {/* Recently Viewed section */}
      <div className="mt-12">
        <H2 className="mb-6">Recently Viewed</H2>
        {viewMode === "table" ? (
          <ConnectionTable data={recentlyViewed} />
        ) : (
          <ConnectionGrid
            data={recentlyViewed}
            size={viewMode === "grid-lg" ? "lg" : "sm"}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition: Empty state                                           */
/* ------------------------------------------------------------------ */

function DataSourcesEmpty() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <H1>Your Data Sources</H1>
      </div>

      <EmptyState
        icon={Database}
        title="No data sources connected"
        description="Connect your first cloud storage bucket to start exploring pathology images."
        action={
          <Button variant="primary" iconLeft={Plus}>
            Connect Storage
          </Button>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Data Sources",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <DataSourcesPage />,
};

export const Empty: Story = {
  render: () => <DataSourcesEmpty />,
};
