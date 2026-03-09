import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import {
  ArrowRight,
  Database,
  FileSearch,
  Folder,
  Image,
  Microscope,
  Pin,
  Plus,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { SectionHeader } from "../components/SectionHeader";
import { StorageConnectionCard } from "../components/StorageConnectionCard";
import { IconButton } from "../components/IconButton";
import { Badge } from "../components/Badge";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";

/* ------------------------------------------------------------------ */
/*  Mock tissue preview                                                */
/* ------------------------------------------------------------------ */

const tissueGradients = [
  [
    "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
    "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
    "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
    "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
  ].join(", "),
  [
    "radial-gradient(ellipse 100px 60px at 40% 45%, rgba(80, 200, 80, 0.35) 0%, transparent 70%)",
    "radial-gradient(ellipse 70px 90px at 60% 55%, rgba(230, 130, 50, 0.3) 0%, transparent 65%)",
    "radial-gradient(ellipse 90px 110px at 45% 50%, rgba(70, 130, 230, 0.2) 0%, transparent 65%)",
    "radial-gradient(circle 25px at 65% 65%, rgba(200, 60, 60, 0.3) 0%, transparent 80%)",
  ].join(", "),
  [
    "radial-gradient(ellipse 110px 80px at 30% 50%, rgba(70, 130, 230, 0.35) 0%, transparent 65%)",
    "radial-gradient(ellipse 90px 100px at 60% 40%, rgba(80, 200, 80, 0.3) 0%, transparent 60%)",
    "radial-gradient(ellipse 70px 60px at 45% 65%, rgba(230, 130, 50, 0.25) 0%, transparent 70%)",
    "radial-gradient(circle 35px at 55% 50%, rgba(200, 60, 60, 0.3) 0%, transparent 75%)",
  ].join(", "),
  [
    "radial-gradient(ellipse 60px 70px at 25% 35%, rgba(70, 130, 230, 0.3) 0%, transparent 60%)",
    "radial-gradient(ellipse 80px 60px at 65% 45%, rgba(70, 130, 230, 0.25) 0%, transparent 65%)",
    "radial-gradient(circle 20px at 35% 55%, rgba(200, 60, 60, 0.25) 0%, transparent 80%)",
  ].join(", "),
];

function MockTissuePreview({ index = 0 }: { index?: number }) {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: "#000000",
        backgroundImage: tissueGradients[index % tissueGradients.length],
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

interface RecentItem {
  name: string;
  type: "file" | "directory";
  fileType?: string;
  provider: string;
  bucketName: string;
  href: string;
  hasPreview?: boolean;
}

interface PinnedItem {
  name: string;
  provider: string;
  bucketName: string;
  href: string;
}

interface StorageConnection {
  name: string;
  provider: string;
  region: string;
  imageCount: number;
  href: string;
  hasPreview?: boolean;
}

const recentImages: RecentItem[] = [
  { name: "sample_001.ome.tif", type: "file", fileType: "OME-TIFF", provider: "aws", bucketName: "cytario-research", href: "#", hasPreview: true },
  { name: "tissue_42.ome.tif", type: "file", fileType: "OME-TIFF", provider: "aws", bucketName: "cytario-research", href: "#", hasPreview: true },
  { name: "biopsy_003.ome.tif", type: "file", fileType: "OME-TIFF", provider: "aws", bucketName: "pathology-archive", href: "#", hasPreview: true },
  { name: "slide_HE_014.ome.tif", type: "file", fileType: "OME-TIFF", provider: "aws", bucketName: "pathology-archive", href: "#", hasPreview: true },
];

const pinnedItems: PinnedItem[] = [
  { name: "results/2024-cohort", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "spatial-analysis/run-42", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "incoming/batch-2025-01", provider: "minio", bucketName: "local-data", href: "#" },
];

const recentDirs: RecentItem[] = [
  { name: "results", type: "directory", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "spatial-analysis", type: "directory", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "incoming", type: "directory", provider: "minio", bucketName: "local-data", href: "#" },
];

const recentFiles: RecentItem[] = [
  { name: "annotations.parquet", type: "file", fileType: "Parquet", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "analysis.csv", type: "file", fileType: "CSV", provider: "aws", bucketName: "cytario-research", href: "#" },
  { name: "metadata.json", type: "file", fileType: "JSON", provider: "minio", bucketName: "local-data", href: "#" },
];

const storageConnections: StorageConnection[] = [
  { name: "cytario-research-data", provider: "aws", region: "eu-central-1", imageCount: 24, href: "#", hasPreview: true },
  { name: "pathology-archive", provider: "aws", region: "eu-central-1", imageCount: 156, href: "#" },
  { name: "tissue-samples-2024", provider: "aws", region: "us-east-1", imageCount: 312, href: "#", hasPreview: true },
  { name: "spatial-biology-cohort", provider: "aws", region: "eu-west-1", imageCount: 89, href: "#" },
  { name: "local-minio-store", provider: "minio", region: "", imageCount: 42, href: "#" },
];

/* ------------------------------------------------------------------ */
/*  Helper: file icon                                                  */
/* ------------------------------------------------------------------ */

function getFileIcon(type?: string): LucideIcon {
  if (type === "OME-TIFF" || type === "TIFF") return Microscope;
  if (type === "PNG" || type === "JPEG") return Image;
  if (type === "CSV" || type === "Parquet" || type === "JSON") return FileSpreadsheet;
  return Folder;
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow bg-[var(--color-surface-default)] px-4 sm:px-6 lg:px-8 py-4">
      <div className="mx-auto max-w-7xl">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Recently Viewed Images (grid)                                      */
/* ------------------------------------------------------------------ */

function RecentImagesSection() {
  return (
    <Section>
      <SectionHeader title="Recently Viewed">
        <Button variant="secondary" size="sm" iconRight={ArrowRight}>
          Show all ({recentImages.length})
        </Button>
      </SectionHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recentImages.map((item, i) => (
          <StorageConnectionCard
            key={item.name}
            name={item.name}
            status="connected"
            href={item.href}
          >
            {item.hasPreview && <MockTissuePreview index={i} />}
          </StorageConnectionCard>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pinned items (list)                                                */
/* ------------------------------------------------------------------ */

function PinnedSection() {
  return (
    <Section>
      <SectionHeader title="Pinned" />
      <Table size="comfortable" aria-label="Pinned items">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Bucket</Column>
          <Column>Provider</Column>
        </TableHeader>
        <TableBody>
          {pinnedItems.map((item) => (
            <Row key={item.name}>
              <Cell>
                <a
                  href={item.href}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 no-underline hover:underline"
                >
                  <Pin size={14} className="shrink-0 text-[var(--color-text-secondary)]" />
                  <span className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    {item.name}
                  </span>
                </a>
              </Cell>
              <Cell>
                <span className="text-[var(--color-text-secondary)]">{item.bucketName}</span>
              </Cell>
              <Cell>
                <Badge variant="purple" size="sm">{item.provider.toUpperCase()}</Badge>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recently Browsed (list)                                            */
/* ------------------------------------------------------------------ */

function RecentDirsSection() {
  return (
    <Section>
      <SectionHeader title="Recently Browsed">
        <Button variant="secondary" size="sm" iconRight={ArrowRight}>
          View all
        </Button>
      </SectionHeader>
      <Table size="comfortable" aria-label="Recently browsed directories">
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Bucket</Column>
          <Column>Provider</Column>
        </TableHeader>
        <TableBody>
          {recentDirs.map((item) => (
            <Row key={item.name}>
              <Cell>
                <a
                  href={item.href}
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 no-underline hover:underline"
                >
                  <Folder size={14} className="shrink-0 text-[var(--color-text-secondary)]" />
                  <span className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    {item.name}
                  </span>
                </a>
              </Cell>
              <Cell>
                <span className="text-[var(--color-text-secondary)]">{item.bucketName}</span>
              </Cell>
              <Cell>
                <Badge variant="purple" size="sm">{item.provider.toUpperCase()}</Badge>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent Files (small grid)                                          */
/* ------------------------------------------------------------------ */

function RecentFilesSection() {
  return (
    <Section>
      <SectionHeader title="Recent Files">
        <Button variant="secondary" size="sm" iconRight={ArrowRight}>
          Show all ({recentFiles.length})
        </Button>
      </SectionHeader>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {recentFiles.map((item) => {
          const FileIcon = getFileIcon(item.fileType);
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => e.preventDefault()}
              className="flex flex-col items-center gap-2 rounded-[var(--border-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 shadow-sm hover:border-[var(--color-border-focus)] hover:shadow-md transition-all no-underline cursor-pointer"
            >
              <FileIcon size={24} className="text-[var(--color-text-secondary)]" />
              <span className="text-[length:var(--font-size-xs)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] truncate max-w-full">
                {item.name}
              </span>
              <span className="text-[length:var(--font-size-xs)] text-[var(--color-text-tertiary)]">
                {item.fileType}
              </span>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Storage Connections (grid)                                         */
/* ------------------------------------------------------------------ */

function StorageConnectionsSection() {
  return (
    <Section>
      <SectionHeader title="Storage Connections">
        <Button variant="secondary" size="sm" iconRight={ArrowRight}>
          Show all ({storageConnections.length})
        </Button>
      </SectionHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {storageConnections.map((conn, i) => (
          <StorageConnectionCard
            key={conn.name}
            name={conn.name}
            provider={conn.provider}
            region={conn.region}
            status="connected"
            imageCount={conn.imageCount}
            href={conn.href}
            onInfo={fn()}
          >
            {conn.hasPreview && <MockTissuePreview index={i} />}
          </StorageConnectionCard>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Full Home Dashboard                                                */
/* ------------------------------------------------------------------ */

function HomeDashboard() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* App Header */}
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <img src="logos/cytario-logo-purple.svg" alt="cytario" className="h-6" />
          <span className="text-sm font-medium text-slate-300">Storage Connections</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-slate-400 w-64">
            Search...
          </div>
          <div className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center text-xs font-bold">
            ML
          </div>
        </div>
      </header>

      {/* Dashboard sections */}
      <div className="space-y-1">
        <RecentImagesSection />
        <PinnedSection />
        <RecentDirsSection />
        <RecentFilesSection />
        <StorageConnectionsSection />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state (first visit)                                          */
/* ------------------------------------------------------------------ */

function HomeDashboardEmpty() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      <header className="flex items-center justify-between bg-slate-950 px-4 py-2 text-white">
        <div className="flex items-center gap-3">
          <img src="logos/cytario-logo-purple.svg" alt="cytario" className="h-6" />
        </div>
        <div className="h-8 w-8 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center text-xs font-bold">
          ML
        </div>
      </header>

      <Section>
        <EmptyState
          icon={FileSearch}
          title="Start exploring your data"
          description="Add a storage connection to view your cloud storage."
          action={
            <Button variant="primary" size="lg" iconLeft={Plus}>
              Connect Storage
            </Button>
          }
        />
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Home Dashboard",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** Full home dashboard with recent images, pinned items, browsed directories, recent files, and storage connections. Mirrors the cytario-web "/" route. */
export const Default: Story = {
  render: () => <HomeDashboard />,
};

/** Empty state shown to new users with no storage connections. */
export const Empty: Story = {
  render: () => <HomeDashboardEmpty />,
};
