import { useCallback, useMemo, useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import {
  Database,
  Download,
  FolderOpen,
  FolderTree,
  Grid3x3,
  Info,
  LayoutGrid,
  List,
  Pencil,
} from "lucide-react";

import { Button } from "../components/Button";
import { ButtonLink } from "../components/ButtonLink";
import { DescriptionList } from "../components/DescriptionList";
import { Dialog } from "../components/Dialog";
import { DialogFooter } from "../components/Dialog/DialogFooter";
import { EmptyState } from "../components/EmptyState";
import {
  FileCard,
  FileIcon,
  getFileIcon,
  getTypeLabel,
} from "../components/FileCard";
import { H1 } from "../components/Heading";
import { IconButton } from "../components/IconButton";
import { InlineConfirmation } from "../components/InlineConfirmation";
import { Input } from "../components/Form/Input";
import { Select, type SelectItem } from "../components/Form/Select";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../components/SegmentedControl";
import { ProviderBadge } from "../components/StorageConnectionCard";
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
      className="mb-4 text-(--font-size-sm) text-(--color-text-secondary)"
    >
      <ol className="flex flex-wrap items-center gap-1 list-none p-0 m-0">
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={segment} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span
                  className="font-medium text-(--color-text-primary)"
                  aria-current="page"
                >
                  {segment}
                </span>
              ) : (
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline text-(--color-text-secondary) no-underline"
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

type ProviderType = "aws" | "minio" | "custom";

interface ConnectionInfo {
  alias: string;
  provider: ProviderType;
  name: string;
  prefix?: string;
  region?: string;
  endpoint?: string;
  roleArn?: string;
  ownerScope?: string;
  createdBy?: string;
  connectionId?: string;
}

interface ConnectionInfoEditable {
  alias: string;
  provider: ProviderType;
  s3Uri: string;
  region: string;
  endpoint: string;
  roleArn: string;
  ownerScope: string;
}

interface FileMetadata {
  name: string;
  size: string;
  lastModified: string;
  contentType?: string;
  storageClass?: string;
  etag?: string;
  versionId?: string;
  isVersioned?: boolean;
}

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
  contentType?: string;
  storageClass?: string;
  etag?: string;
  versionId?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProviderOptions: SelectItem[] = [
  { id: "aws", name: "AWS" },
  { id: "minio", name: "MinIO" },
  { id: "custom", name: "Custom" },
];

function buildS3Uri(name: string, prefix?: string): string {
  return prefix ? `${name}/${prefix}` : name;
}

function isAwsProvider(provider: string): boolean {
  return provider === "aws";
}

function truncate(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}...`;
}

/* ------------------------------------------------------------------ */
/*  Inline ConnectionInfoDialog                                        */
/* ------------------------------------------------------------------ */

function ConnectionInfoDialog({
  isOpen,
  onOpenChange,
  connection,
  groups = [],
  providerOptions = defaultProviderOptions,
  bucketHref,
  onSave,
  onRemove,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  connection: ConnectionInfo;
  groups?: SelectItem[];
  providerOptions?: SelectItem[];
  bucketHref?: string;
  onSave?: (fields: ConnectionInfoEditable) => void;
  onRemove?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) setIsEditing(false);
      onOpenChange(open);
    },
    [onOpenChange],
  );

  const handleSave = useCallback(
    (fields: ConnectionInfoEditable) => {
      onSave?.(fields);
      setIsEditing(false);
    },
    [onSave],
  );

  const title = isEditing ? "Edit Connection" : connection.alias;
  const isAws = isAwsProvider(connection.provider);
  const s3Uri = buildS3Uri(connection.name, connection.prefix);

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange} title={title} size="lg">
      {isEditing ? (
        <ConnectionEditMode
          connection={connection}
          groups={groups}
          providerOptions={providerOptions}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <DescriptionList>
            <DescriptionList.Item label="Provider">
              <ProviderBadge provider={connection.provider} />
            </DescriptionList.Item>
            {connection.ownerScope && (
              <DescriptionList.Item label="Visibility">
                <>Shared with: <span className="font-medium text-(--color-text-primary)">{connection.ownerScope}</span></>
              </DescriptionList.Item>
            )}
            <DescriptionList.Item label="S3 URI">
              <span><span className="text-(--color-text-secondary)">s3://</span>{s3Uri}</span>
            </DescriptionList.Item>
            {isAws && connection.region && (
              <DescriptionList.Item label="Region">{connection.region}</DescriptionList.Item>
            )}
            <DescriptionList.Item label="Endpoint">
              {isAws && !connection.endpoint ? (
                <span className="text-(--color-text-secondary)">(default AWS endpoint)</span>
              ) : connection.endpoint}
            </DescriptionList.Item>
            {isAws && connection.roleArn && (
              <DescriptionList.Item label="Role ARN">{connection.roleArn}</DescriptionList.Item>
            )}
            {connection.createdBy && (
              <DescriptionList.Item label="Created by" muted>{connection.createdBy}</DescriptionList.Item>
            )}
            {connection.connectionId && (
              <DescriptionList.Item label="Connection ID" muted>{connection.connectionId}</DescriptionList.Item>
            )}
          </DescriptionList>
          <DialogFooter>
            {bucketHref ? <ButtonLink href={bucketHref} variant="secondary" size="md">Open Bucket</ButtonLink> : <div />}
            <Button variant="ghost" size="md" iconLeft={Pencil} onPress={() => setIsEditing(true)}>Edit</Button>
            {onRemove ? <Button variant="destructive" size="md" onPress={onRemove}>Remove Connection</Button> : <div />}
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}

function ConnectionEditMode({
  connection,
  groups,
  providerOptions,
  onSave,
  onCancel,
}: {
  connection: ConnectionInfo;
  groups: SelectItem[];
  providerOptions: SelectItem[];
  onSave?: (fields: ConnectionInfoEditable) => void;
  onCancel: () => void;
}) {
  const [alias, setAlias] = useState(connection.alias);
  const [provider, setProvider] = useState<ProviderType>(connection.provider);
  const [s3Uri, setS3Uri] = useState(buildS3Uri(connection.name, connection.prefix));
  const [region, setRegion] = useState(connection.region ?? "");
  const [endpoint, setEndpoint] = useState(connection.endpoint ?? "");
  const [roleArn, setRoleArn] = useState(connection.roleArn ?? "");
  const [ownerScope, setOwnerScope] = useState(connection.ownerScope ?? "");
  const isAws = isAwsProvider(provider);

  const handleSave = useCallback(() => {
    onSave?.({ alias, provider, s3Uri, region, endpoint, roleArn, ownerScope });
  }, [alias, provider, s3Uri, region, endpoint, roleArn, ownerScope, onSave]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Input label="Alias" value={alias} onChange={setAlias} />
        <Select label="Provider" items={providerOptions} selectedKey={provider} onSelectionChange={(key) => setProvider(key as ProviderType)} />
        {groups.length > 0 && <Select label="Visibility" items={groups} selectedKey={ownerScope} onSelectionChange={(key) => setOwnerScope(key as string)} />}
        <Input label="S3 URI" prefix="s3://" value={s3Uri} onChange={setS3Uri} />
        {isAws && <Input label="Region" value={region} onChange={setRegion} />}
        <Input label="Endpoint" value={endpoint} onChange={setEndpoint} description={isAws ? "Leave empty for default AWS endpoint" : "Required for non-AWS providers"} />
        {isAws && <Input label="Role ARN" value={roleArn} onChange={setRoleArn} description="Optional. IAM role for cross-account access" />}
      </div>
      <DialogFooter>
        <Button variant="ghost" size="md" onPress={onCancel}>Cancel</Button>
        <Button variant="primary" size="md" onPress={handleSave}>Save Changes</Button>
      </DialogFooter>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline FileInfoDialog                                              */
/* ------------------------------------------------------------------ */

function FileInfoDialog({
  isOpen,
  onOpenChange,
  file,
  fileHref,
  onDownload,
  onDelete,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  file: FileMetadata;
  fileHref?: string;
  onDownload?: () => void;
  onDelete?: () => void;
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) setIsConfirmingDelete(false);
      onOpenChange(open);
    },
    [onOpenChange],
  );

  const handleConfirmDelete = useCallback(() => {
    onDelete?.();
    setIsConfirmingDelete(false);
  }, [onDelete]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange} title={file.name} size="md">
      <DescriptionList layout="horizontal">
        <DescriptionList.Item label="Size">{file.size}</DescriptionList.Item>
        <DescriptionList.Item label="Last Modified">{file.lastModified}</DescriptionList.Item>
        {file.contentType && <DescriptionList.Item label="Content Type">{file.contentType}</DescriptionList.Item>}
        {file.storageClass && <DescriptionList.Item label="Storage Class">{file.storageClass}</DescriptionList.Item>}
        {file.etag && <DescriptionList.Item label="ETag" muted fullValue={file.etag}>{truncate(file.etag, 12)}</DescriptionList.Item>}
        {file.isVersioned && file.versionId && <DescriptionList.Item label="Version ID" muted fullValue={file.versionId}>{truncate(file.versionId, 12)}</DescriptionList.Item>}
      </DescriptionList>
      {isConfirmingDelete ? (
        <InlineConfirmation
          message="Are you sure you want to delete this file?"
          description="This action cannot be undone."
          confirmLabel="Yes, Delete File"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      ) : (
        <DialogFooter>
          {fileHref ? <ButtonLink href={fileHref} variant="secondary" size="md">Open File</ButtonLink> : <div />}
          {onDownload ? <Button variant="primary" size="md" onPress={onDownload}>Download</Button> : <div />}
          {onDelete ? <Button variant="destructive" size="md" onPress={() => setIsConfirmingDelete(true)}>Delete</Button> : <div />}
        </DialogFooter>
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const mockConnection: ConnectionInfo = {
  alias: "cytario-research-data",
  provider: "aws",
  name: "cytario-research-data",
  prefix: "slides/",
  region: "eu-central-1",
  endpoint: "",
  roleArn: "arn:aws:iam::123456789012:role/cytario-read",
  ownerScope: "vericura-pathology",
  createdBy: "m.schneider@vericura.com",
  connectionId: "conn-a8f3e21b",
};

const mockGroups = [
  { id: "vericura-pathology", name: "vericura-pathology" },
  { id: "cytario-dev", name: "cytario-dev" },
  { id: "cytario-admin", name: "cytario-admin" },
];

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
        contentType: "image/tiff",
        storageClass: "STANDARD",
        etag: "b4c7d2e1f0a9b8c7d6e5f4a3b2c1d0e9",
        versionId: "xK9j4mQpR2wYz8aBcDeFgHiJkLmNoP",
      },
      {
        name: "output_002.ome.tif",
        type: "file",
        size: "8.7 GB",
        sizeBytes: 8_700_000_000,
        modified: "2025-12-10 09:17",
        extension: "ome.tif",
        hasPreview: true,
        contentType: "image/tiff",
        storageClass: "STANDARD",
        etag: "c5d8e3f2a1b0c9d8e7f6a5b4c3d2e1f0",
      },
      {
        name: "summary.csv",
        type: "file",
        size: "340 KB",
        sizeBytes: 340_000,
        modified: "2025-12-09 16:45",
        extension: "csv",
        contentType: "text/csv",
        storageClass: "STANDARD",
        etag: "d6e9f4a3b2c1d0e9f8a7b6c5d4e3f2a1",
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
    contentType: "image/tiff",
    storageClass: "STANDARD",
    etag: "a3f8c91b2d4e6f7a8b9c0d1e2f3a4b5c",
    versionId: "v8Kj2mNpQ3xYz1aBcDeFgHiJkLmNoP",
  },
  {
    name: "tissue_42.ome.tif",
    type: "file",
    size: "22.65 GB",
    sizeBytes: 22_650_000_000,
    modified: "2025-12-10 09:17",
    extension: "ome.tif",
    hasPreview: true,
    contentType: "image/tiff",
    storageClass: "STANDARD",
    etag: "e7f0a5b4c3d2e1f0a9b8c7d6e5f4a3b2",
  },
  {
    name: "biopsy_003.ome.tif",
    type: "file",
    size: "45.12 GB",
    sizeBytes: 45_120_000_000,
    modified: "2025-12-08 11:20",
    extension: "ome.tif",
    hasPreview: true,
    contentType: "image/tiff",
    storageClass: "STANDARD",
    etag: "f8a1b6c5d4e3f2a1b0c9d8e7f6a5b4c3",
  },
  {
    name: "analysis.csv",
    type: "file",
    size: "1.2 MB",
    sizeBytes: 1_200_000,
    modified: "2025-12-09 16:45",
    extension: "csv",
    contentType: "text/csv",
    storageClass: "STANDARD",
    etag: "a9b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8",
  },
  {
    name: "annotations.parquet",
    type: "file",
    size: "4.8 MB",
    sizeBytes: 4_800_000,
    modified: "2025-12-07 08:30",
    extension: "parquet",
    contentType: "application/octet-stream",
    storageClass: "STANDARD",
    etag: "b0c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9",
  },
  {
    name: "thumbnail.png",
    type: "file",
    size: "256 KB",
    sizeBytes: 256_000,
    modified: "2025-12-06 15:00",
    extension: "png",
    contentType: "image/png",
    storageClass: "STANDARD",
    etag: "c1d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0",
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
/*  Helper: FileNode -> FileMetadata                                   */
/* ------------------------------------------------------------------ */

function toFileMetadata(node: FileNode): FileMetadata {
  return {
    name: node.name,
    size: node.size ?? "Unknown",
    lastModified: node.modified ? `${node.modified} UTC` : "Unknown",
    contentType: node.contentType,
    storageClass: node.storageClass,
    etag: node.etag,
    versionId: node.versionId,
    isVersioned: !!node.versionId,
  };
}

/* ------------------------------------------------------------------ */
/*  Story-local FileCard wrapper (bridges FileNode -> FileCard props)   */
/* ------------------------------------------------------------------ */

function FileCardItem({
  node,
  compact = false,
  previewIndex,
  onInfo,
}: {
  node: FileNode;
  compact?: boolean;
  previewIndex?: number;
  onInfo?: () => void;
}) {
  return (
    <FileCard
      name={node.name}
      type={node.type}
      size={node.size}
      extension={node.extension}
      compact={compact}
      href="#"
      onInfo={onInfo}
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
  onFileInfo,
}: {
  nodes: FileNode[];
  compact?: boolean;
  onFileInfo?: (node: FileNode) => void;
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
          onInfo={onFileInfo ? () => onFileInfo(node) : undefined}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  List view (Table)                                                  */
/* ------------------------------------------------------------------ */

function ListView({
  nodes,
  onFileInfo,
}: {
  nodes: FileNode[];
  onFileInfo?: (node: FileNode) => void;
}) {
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
                className="flex items-center gap-2 font-medium text-(--color-text-primary) no-underline hover:underline"
              >
                <FileIcon type={node.type} extension={node.extension} />
                {node.name}
              </a>
            </Cell>
            <Cell>
              <span
                className={[
                  "inline-flex items-center",
                  "rounded-sm",
                  "px-1.5 py-0.5",
                  "text-(--font-size-xs)",
                  "font-medium",
                  "bg-(--color-surface-muted)",
                  "text-(--color-text-secondary)",
                ].join(" ")}
              >
                {getTypeLabel(node.type, node.extension)}
              </span>
            </Cell>
            <Cell>
              <span className="tabular-nums text-(--color-text-secondary)">
                {node.size ?? "\u2014"}
              </span>
            </Cell>
            <Cell>
              <span className="text-(--color-text-secondary)">
                {node.modified ?? "\u2014"}
              </span>
            </Cell>
            <Cell>
              <IconButton
                icon={Info}
                aria-label={`Show info for ${node.name}`}
                variant="ghost"
                size="sm"
                onPress={onFileInfo ? () => onFileInfo(node) : undefined}
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
    <div className="overflow-hidden rounded-md border border-(--color-border-default)">
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

  // Modal state
  const [connectionInfoOpen, setConnectionInfoOpen] = useState(false);
  const [fileInfoNode, setFileInfoNode] = useState<FileNode | null>(null);

  const filteredNodes =
    viewMode !== "tree" && searchTerm
      ? mockNodes.filter((n) =>
          n.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : mockNodes;

  const handleFileInfo = (node: FileNode) => {
    if (node.type === "file") setFileInfoNode(node);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Row 1: Page title + actions */}
      <div className="mb-2 flex items-center justify-between gap-4">
        <H1 size="xl">
          cytario-research-data
        </H1>
        <div className="flex items-center gap-2">
          <IconButton
            icon={Database}
            aria-label="Connection info"
            variant="ghost"
            onPress={() => setConnectionInfoOpen(true)}
          />
          <ButtonLink
            href="#"
            variant="secondary"
            iconLeft={Download}
          >
            Access with Cyberduck
          </ButtonLink>
        </div>
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
      {viewMode === "list" && (
        <ListView nodes={filteredNodes} onFileInfo={handleFileInfo} />
      )}
      {viewMode === "grid" && (
        <GridView nodes={filteredNodes} onFileInfo={handleFileInfo} />
      )}
      {viewMode === "grid-compact" && (
        <GridView nodes={filteredNodes} compact onFileInfo={handleFileInfo} />
      )}
      {viewMode === "tree" && (
        <TreeView nodes={mockNodes} searchTerm={searchTerm} />
      )}

      {/* Connection Info Dialog */}
      <ConnectionInfoDialog
        isOpen={connectionInfoOpen}
        onOpenChange={setConnectionInfoOpen}
        connection={mockConnection}
        groups={mockGroups}
        bucketHref="#"
        onSave={() => setConnectionInfoOpen(false)}
        onRemove={() => setConnectionInfoOpen(false)}
      />

      {/* File Info Dialog */}
      {fileInfoNode && (
        <FileInfoDialog
          isOpen={!!fileInfoNode}
          onOpenChange={(open) => {
            if (!open) setFileInfoNode(null);
          }}
          file={toFileMetadata(fileInfoNode)}
          fileHref="#"
          onDownload={() => {}}
          onDelete={() => setFileInfoNode(null)}
        />
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
