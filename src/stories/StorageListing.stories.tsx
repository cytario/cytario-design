import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import {
  Download,
  FolderOpen,
  FolderTree,
  Grid3x3,
  Info,
  LayoutGrid,
  List,
} from "lucide-react";

import { ButtonLink } from "../components/ButtonLink";
import { EmptyState } from "../components/EmptyState";
import {
  FileCard,
  FileIcon,
  getFileIcon,
  getTypeLabel,
} from "../components/FileCard";
import { H1 } from "../components/Heading";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../components/SegmentedControl";
import {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "../components/Table";
import { Tree, type TreeNode as DesignTreeNode } from "../components/Tree";

/* ------------------------------------------------------------------ */
/*  Breadcrumb (lightweight, story-local)                              */
/* ------------------------------------------------------------------ */

function Breadcrumbs({ segments }: { segments: string[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
    >
      <ol className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={segment} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span
                  className="font-[var(--font-weight-medium)] text-[var(--color-text-primary)]"
                  aria-current="page"
                >
                  {segment}
                </span>
              ) : (
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline text-[var(--color-text-secondary)] no-underline"
                >
                  {segment}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ViewMode = "list" | "grid" | "grid-compact" | "tree";
type NodeType = "directory" | "file";

interface FileNode {
  name: string;
  type: NodeType;
  size?: string;
  sizeBytes?: number;
  modified?: string;
  extension?: string;
  children?: FileNode[];
  hasPreview?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockNodes: FileNode[] = [
  {
    name: "results",
    type: "directory",
    modified: "2025-12-10",
    children: [
      {
        name: "output_001.ome.tif",
        type: "file",
        size: "12.3 GB",
        sizeBytes: 12_300_000_000,
        modified: "2025-12-10 14:32",
        extension: "ome.tif",
        hasPreview: true,
      },
      {
        name: "output_002.ome.tif",
        type: "file",
        size: "8.7 GB",
        sizeBytes: 8_700_000_000,
        modified: "2025-12-10 09:17",
        extension: "ome.tif",
        hasPreview: true,
      },
      {
        name: "summary.csv",
        type: "file",
        size: "340 KB",
        sizeBytes: 340_000,
        modified: "2025-12-09 16:45",
        extension: "csv",
      },
    ],
  },
  {
    name: "sample_001.ome.tif",
    type: "file",
    size: "81.93 GB",
    sizeBytes: 81_930_000_000,
    modified: "2025-12-10 14:32",
    extension: "ome.tif",
    hasPreview: true,
  },
  {
    name: "tissue_42.ome.tif",
    type: "file",
    size: "22.65 GB",
    sizeBytes: 22_650_000_000,
    modified: "2025-12-10 09:17",
    extension: "ome.tif",
    hasPreview: true,
  },
  {
    name: "biopsy_003.ome.tif",
    type: "file",
    size: "45.12 GB",
    sizeBytes: 45_120_000_000,
    modified: "2025-12-08 11:20",
    extension: "ome.tif",
    hasPreview: true,
  },
  {
    name: "analysis.csv",
    type: "file",
    size: "1.2 MB",
    sizeBytes: 1_200_000,
    modified: "2025-12-09 16:45",
    extension: "csv",
  },
  {
    name: "annotations.parquet",
    type: "file",
    size: "4.8 MB",
    sizeBytes: 4_800_000,
    modified: "2025-12-07 08:30",
    extension: "parquet",
  },
  {
    name: "thumbnail.png",
    type: "file",
    size: "256 KB",
    sizeBytes: 256_000,
    modified: "2025-12-06 15:00",
    extension: "png",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock fluorescence tissue preview                                   */
/* ------------------------------------------------------------------ */

const tissueGradients = [
  // DAPI blue dominant channel
  [
    "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
    "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
    "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
    "radial-gradient(ellipse 60px 80px at 20% 70%, rgba(70, 130, 230, 0.35) 0%, transparent 70%)",
    "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
  ].join(", "),
  // Multi-channel green/red
  [
    "radial-gradient(ellipse 100px 60px at 40% 45%, rgba(80, 200, 80, 0.35) 0%, transparent 70%)",
    "radial-gradient(ellipse 70px 90px at 60% 55%, rgba(230, 130, 50, 0.3) 0%, transparent 65%)",
    "radial-gradient(ellipse 90px 110px at 45% 50%, rgba(70, 130, 230, 0.2) 0%, transparent 65%)",
    "radial-gradient(circle 25px at 65% 65%, rgba(200, 60, 60, 0.3) 0%, transparent 80%)",
  ].join(", "),
  // Sparse DAPI
  [
    "radial-gradient(ellipse 60px 70px at 25% 35%, rgba(70, 130, 230, 0.3) 0%, transparent 60%)",
    "radial-gradient(ellipse 80px 60px at 65% 45%, rgba(70, 130, 230, 0.25) 0%, transparent 65%)",
    "radial-gradient(circle 20px at 35% 55%, rgba(200, 60, 60, 0.25) 0%, transparent 80%)",
    "radial-gradient(ellipse 90px 70px at 50% 70%, rgba(80, 200, 80, 0.15) 0%, transparent 65%)",
  ].join(", "),
  // Dense multi-channel
  [
    "radial-gradient(ellipse 110px 80px at 30% 50%, rgba(70, 130, 230, 0.35) 0%, transparent 65%)",
    "radial-gradient(ellipse 90px 100px at 60% 40%, rgba(80, 200, 80, 0.3) 0%, transparent 60%)",
    "radial-gradient(ellipse 70px 60px at 45% 65%, rgba(230, 130, 50, 0.25) 0%, transparent 70%)",
    "radial-gradient(circle 35px at 55% 50%, rgba(200, 60, 60, 0.3) 0%, transparent 75%)",
    "radial-gradient(ellipse 50px 70px at 75% 60%, rgba(70, 130, 230, 0.2) 0%, transparent 60%)",
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
/*  Story-local FileCard wrapper (bridges FileNode -> FileCard props)   */
/* ------------------------------------------------------------------ */

function FileCardItem({
  node,
  compact = false,
  previewIndex,
}: {
  node: FileNode;
  compact?: boolean;
  previewIndex?: number;
}) {
  return (
    <FileCard
      name={node.name}
      type={node.type}
      size={node.size}
      extension={node.extension}
      compact={compact}
      href="#"
      onInfo={() => {}}
    >
      {node.hasPreview && previewIndex != null ? (
        <MockTissuePreview index={previewIndex} />
      ) : undefined}
    </FileCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid view                                                          */
/* ------------------------------------------------------------------ */

function GridView({
  nodes,
  compact = false,
}: {
  nodes: FileNode[];
  compact?: boolean;
}) {
  const gridClass = compact
    ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6";

  // Pre-compute preview indices so we avoid mutation inside the render map.
  const previewIndices = useMemo(() => {
    const indices = new Map<string, number>();
    let counter = 0;
    for (const node of nodes) {
      if (node.hasPreview) {
        indices.set(node.name, counter++);
      }
    }
    return indices;
  }, [nodes]);

  return (
    <div className={gridClass}>
      {nodes.map((node) => (
        <FileCardItem
          key={node.name}
          node={node}
          compact={compact}
          previewIndex={previewIndices.get(node.name)}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List view (Table)                                                  */
/* ------------------------------------------------------------------ */

function ListView({ nodes }: { nodes: FileNode[] }) {
  // Sort: directories first, then files
  const sorted = [...nodes].sort((a, b) => {
    if (a.type === "directory" && b.type !== "directory") return -1;
    if (a.type !== "directory" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Table size="comfortable" aria-label="File listing">
      <TableHeader>
        <Column isRowHeader>Name</Column>
        <Column>Type</Column>
        <Column>Size</Column>
        <Column>Modified</Column>
        <Column>Actions</Column>
      </TableHeader>
      <TableBody>
        {sorted.map((node) => (
          <Row key={node.name}>
            <Cell>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 font-[var(--font-weight-medium)] text-[var(--color-text-primary)] no-underline hover:underline"
              >
                <FileIcon type={node.type} extension={node.extension} />
                {node.name}
              </a>
            </Cell>
            <Cell>
              <span
                className={[
                  "inline-flex items-center",
                  "rounded-[var(--border-radius-sm)]",
                  "px-1.5 py-0.5",
                  "text-[var(--font-size-xs)]",
                  "font-[var(--font-weight-medium)]",
                  "bg-[var(--color-surface-muted)]",
                  "text-[var(--color-text-secondary)]",
                ].join(" ")}
              >
                {getTypeLabel(node.type, node.extension)}
              </span>
            </Cell>
            <Cell>
              <span className="tabular-nums text-[var(--color-text-secondary)]">
                {node.size ?? "\u2014"}
              </span>
            </Cell>
            <Cell>
              <span className="text-[var(--color-text-secondary)]">
                {node.modified ?? "\u2014"}
              </span>
            </Cell>
            <Cell>
              <IconButton
                icon={Info}
                aria-label={`Show info for ${node.name}`}
                variant="ghost"
                size="sm"
              />
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Tree view                                                          */
/* ------------------------------------------------------------------ */

function toDesignTreeNodes(nodes: FileNode[]): DesignTreeNode[] {
  return nodes.map((node) => ({
    id: node.name,
    name: node.size ? `${node.name}  ·  ${node.size}` : node.name,
    icon: getFileIcon(node.type, node.extension),
    children: node.children ? toDesignTreeNodes(node.children) : undefined,
  }));
}

function TreeView({
  nodes,
  searchTerm,
}: {
  nodes: FileNode[];
  searchTerm?: string;
}) {
  const treeData = useMemo(() => toDesignTreeNodes(nodes), [nodes]);

  return (
    <div className="overflow-hidden rounded-[var(--border-radius-md)] border border-[var(--color-border-default)]">
      <Tree
        aria-label="Directory tree"
        data={treeData}
        selectionMode="none"
        openByDefault={true}
        size="comfortable"
        height={600}
        searchTerm={searchTerm}
        searchMatch={(node, term) =>
          node.name.toLowerCase().includes(term.toLowerCase())
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition: Storage Listing Page                                  */
/* ------------------------------------------------------------------ */

function StorageListingPage({
  initialViewMode = "grid",
}: {
  initialViewMode?: ViewMode;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNodes =
    viewMode !== "tree" && searchTerm
      ? mockNodes.filter((n) =>
          n.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : mockNodes;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Row 1: Page title + action */}
      <div className="mb-2 flex items-center justify-between gap-4">
        <H1 size="xl">
          cytario-research-data
        </H1>
        <ButtonLink
          href="#"
          variant="secondary"
          iconLeft={Download}
        >
          Access with Cyberduck
        </ButtonLink>
      </div>

      <Breadcrumbs segments={["Home", "cytario-research-data", "results"]} />

      {/* Row 2: Search + View mode */}
      <div className="mb-6 flex items-center justify-between gap-3 min-h-[40px]">
        <Input
          aria-label="Filter files"
          placeholder="Filter files..."
          size="sm"
          value={searchTerm}
          onChange={setSearchTerm}
          className="w-64"
        />
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
          <SegmentedControlItem id="list" aria-label="List view">
            <List size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="grid" aria-label="Grid view">
            <LayoutGrid size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="grid-compact" aria-label="Compact grid">
            <Grid3x3 size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="tree" aria-label="Tree view">
            <FolderTree size={16} />
          </SegmentedControlItem>
        </SegmentedControl>
      </div>

      {/* Content area */}
      {viewMode === "list" && <ListView nodes={filteredNodes} />}
      {viewMode === "grid" && <GridView nodes={filteredNodes} />}
      {viewMode === "grid-compact" && (
        <GridView nodes={filteredNodes} compact />
      )}
      {viewMode === "tree" && (
        <TreeView nodes={mockNodes} searchTerm={searchTerm} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composition: Empty state                                           */
/* ------------------------------------------------------------------ */

function StorageListingEmpty() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-2 flex items-center justify-between gap-4">
        <H1 size="xl">
          empty-bucket
        </H1>
        <ButtonLink
          href="#"
          variant="secondary"
          iconLeft={Download}
        >
          Access with Cyberduck
        </ButtonLink>
      </div>

      <Breadcrumbs segments={["Home", "empty-bucket"]} />

      <EmptyState
        icon={FolderOpen}
        title="This folder is empty"
        description="No files or folders found in this location."
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Storage Listing",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <StorageListingPage />,
};

export const CompactGrid: Story = {
  render: () => <StorageListingPage initialViewMode="grid-compact" />,
};

export const Empty: Story = {
  render: () => <StorageListingEmpty />,
};
