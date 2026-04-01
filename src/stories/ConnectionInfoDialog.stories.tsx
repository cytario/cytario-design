import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Pencil } from "lucide-react";
import { Dialog } from "../components/Dialog";
import { DialogFooter } from "../components/Dialog/DialogFooter";
import { Button } from "../components/Button";
import { ButtonLink } from "../components/ButtonLink";
import { Input } from "../components/Form/Input";
import { Select, type SelectItem } from "../components/Form/Select";
import { DescriptionList } from "../components/DescriptionList";
import { ProviderBadge } from "../components/StorageConnectionCard";

/* ------------------------------------------------------------------ */
/*  Domain types (app-specific, not part of the design system)         */
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

interface ConnectionInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  connection: ConnectionInfo;
  groups?: SelectItem[];
  providerOptions?: SelectItem[];
  bucketHref?: string;
  onSave?: (fields: ConnectionInfoEditable) => void;
  onRemove?: () => void;
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

/* ------------------------------------------------------------------ */
/*  View Mode                                                          */
/* ------------------------------------------------------------------ */

function ViewMode({
  connection,
  bucketHref,
  onEdit,
  onRemove,
}: {
  connection: ConnectionInfo;
  bucketHref?: string;
  onEdit: () => void;
  onRemove?: () => void;
}) {
  const isAws = isAwsProvider(connection.provider);
  const s3Uri = buildS3Uri(connection.name, connection.prefix);

  return (
    <>
      <DescriptionList>
        <DescriptionList.Item label="Provider">
          <ProviderBadge provider={connection.provider} />
        </DescriptionList.Item>

        {connection.ownerScope && (
          <DescriptionList.Item label="Visibility">
            <>
              Shared with:{" "}
              <span className="font-medium text-(--color-text-primary)">
                {connection.ownerScope}
              </span>
            </>
          </DescriptionList.Item>
        )}

        <DescriptionList.Item label="S3 URI">
          <span>
            <span className="text-(--color-text-secondary)">s3://</span>
            {s3Uri}
          </span>
        </DescriptionList.Item>

        {isAws && connection.region && (
          <DescriptionList.Item label="Region">
            {connection.region}
          </DescriptionList.Item>
        )}

        <DescriptionList.Item label="Endpoint">
          {isAws && !connection.endpoint ? (
            <span className="text-(--color-text-secondary)">
              (default AWS endpoint)
            </span>
          ) : (
            connection.endpoint
          )}
        </DescriptionList.Item>

        {isAws && connection.roleArn && (
          <DescriptionList.Item label="Role ARN">
            {connection.roleArn}
          </DescriptionList.Item>
        )}

        {connection.createdBy && (
          <DescriptionList.Item label="Created by" muted>
            {connection.createdBy}
          </DescriptionList.Item>
        )}

        {connection.connectionId && (
          <DescriptionList.Item label="Connection ID" muted>
            {connection.connectionId}
          </DescriptionList.Item>
        )}
      </DescriptionList>

      <DialogFooter>
        {bucketHref ? (
          <ButtonLink href={bucketHref} variant="secondary" size="md">
            Open Bucket
          </ButtonLink>
        ) : (
          <div />
        )}
        <Button variant="ghost" size="md" iconLeft={Pencil} onPress={onEdit}>
          Edit
        </Button>
        {onRemove ? (
          <Button variant="destructive" size="md" onPress={onRemove}>
            Remove Connection
          </Button>
        ) : (
          <div />
        )}
      </DialogFooter>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit Mode                                                          */
/* ------------------------------------------------------------------ */

function EditMode({
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
  const [s3Uri, setS3Uri] = useState(
    buildS3Uri(connection.name, connection.prefix),
  );
  const [region, setRegion] = useState(connection.region ?? "");
  const [endpoint, setEndpoint] = useState(connection.endpoint ?? "");
  const [roleArn, setRoleArn] = useState(connection.roleArn ?? "");
  const [ownerScope, setOwnerScope] = useState(connection.ownerScope ?? "");

  const isAws = isAwsProvider(provider);

  const handleSave = useCallback(() => {
    onSave?.({
      alias,
      provider,
      s3Uri,
      region,
      endpoint,
      roleArn,
      ownerScope,
    });
  }, [alias, provider, s3Uri, region, endpoint, roleArn, ownerScope, onSave]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Input label="Alias" value={alias} onChange={setAlias} />

        <Select
          label="Provider"
          items={providerOptions}
          selectedKey={provider}
          onSelectionChange={(key) => setProvider(key as ProviderType)}
        />

        {groups.length > 0 && (
          <Select
            label="Visibility"
            items={groups}
            selectedKey={ownerScope}
            onSelectionChange={(key) => setOwnerScope(key as string)}
          />
        )}

        <Input
          label="S3 URI"
          prefix="s3://"
          value={s3Uri}
          onChange={setS3Uri}
        />

        {isAws && (
          <Input label="Region" value={region} onChange={setRegion} />
        )}

        <Input
          label="Endpoint"
          value={endpoint}
          onChange={setEndpoint}
          description={
            isAws
              ? "Leave empty for default AWS endpoint"
              : "Required for non-AWS providers"
          }
        />

        {isAws && (
          <Input
            label="Role ARN"
            value={roleArn}
            onChange={setRoleArn}
            description="Optional. IAM role for cross-account access"
          />
        )}
      </div>

      <DialogFooter>
        <Button variant="ghost" size="md" onPress={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onPress={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  ConnectionInfoDialog (story-local composition)                     */
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
}: ConnectionInfoDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsEditing(false);
      }
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

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={title}
      size="lg"
    >
      {isEditing ? (
        <EditMode
          connection={connection}
          groups={groups}
          providerOptions={providerOptions}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ViewMode
          connection={connection}
          bucketHref={bucketHref}
          onEdit={() => setIsEditing(true)}
          onRemove={onRemove}
        />
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const awsConnection: ConnectionInfo = {
  alias: "vericura internal",
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

const minioConnection: ConnectionInfo = {
  alias: "local dev storage",
  provider: "minio",
  name: "dev-pathology-bucket",
  prefix: "wsi/",
  endpoint: "https://minio.internal.cytario.io:9000",
  ownerScope: "cytario-dev",
  createdBy: "devops@cytario.com",
  connectionId: "conn-f7b2c41d",
};

const groups: SelectItem[] = [
  { id: "vericura-pathology", name: "vericura-pathology" },
  { id: "cytario-dev", name: "cytario-dev" },
  { id: "cytario-admin", name: "cytario-admin" },
];

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/ConnectionInfoDialog",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const ViewModeAWS: Story = {
  name: "View Mode (AWS)",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Connection Info</Button>
        <ConnectionInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          connection={awsConnection}
          groups={groups}
          bucketHref="/buckets/aws/cytario-research-data"
          onSave={fn()}
          onRemove={fn()}
        />
      </>
    );
  },
};

export const ViewModeMinIO: Story = {
  name: "View Mode (MinIO)",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Connection Info</Button>
        <ConnectionInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          connection={minioConnection}
          groups={groups}
          bucketHref="/buckets/minio/dev-pathology-bucket"
          onSave={fn()}
          onRemove={fn()}
        />
      </>
    );
  },
};

export const EditModeAWS: Story = {
  name: "Edit Mode (AWS)",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Connection Info</Button>
        <ConnectionInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          connection={awsConnection}
          groups={groups}
          bucketHref="/buckets/aws/cytario-research-data"
          onSave={fn()}
          onRemove={fn()}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const editButton = await canvas.findByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    await expect(
      canvas.getByRole("heading", { name: "Edit Connection" }),
    ).toBeInTheDocument();
  },
};

export const EditModeCustom: Story = {
  name: "Edit Mode (Custom/MinIO)",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Connection Info</Button>
        <ConnectionInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          connection={minioConnection}
          groups={groups}
          bucketHref="/buckets/minio/dev-pathology-bucket"
          onSave={fn()}
          onRemove={fn()}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const editButton = await canvas.findByRole("button", { name: /edit/i });
    await userEvent.click(editButton);

    await expect(
      canvas.getByRole("heading", { name: "Edit Connection" }),
    ).toBeInTheDocument();
  },
};

export const CancelEdit: Story = {
  name: "Cancel Edit Returns to View",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Connection Info</Button>
        <ConnectionInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          connection={awsConnection}
          groups={groups}
          onSave={fn()}
          onRemove={fn()}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const editButton = await canvas.findByRole("button", { name: /edit/i });
    await userEvent.click(editButton);
    await expect(
      canvas.getByRole("heading", { name: "Edit Connection" }),
    ).toBeInTheDocument();

    const cancelButton = canvas.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    await expect(
      canvas.getByRole("heading", { name: awsConnection.alias }),
    ).toBeInTheDocument();
  },
};
