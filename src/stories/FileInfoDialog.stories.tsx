import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Dialog } from "../components/Dialog";
import { DialogFooter } from "../components/Dialog/DialogFooter";
import { Button } from "../components/Button";
import { ButtonLink } from "../components/ButtonLink";
import { DescriptionList } from "../components/DescriptionList";
import { InlineConfirmation } from "../components/InlineConfirmation";

/* ------------------------------------------------------------------ */
/*  Domain types (app-specific, not part of the design system)         */
/* ------------------------------------------------------------------ */

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

interface FileInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  file: FileMetadata;
  fileHref?: string;
  onDownload?: () => void;
  onDelete?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function truncate(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}...`;
}

/* ------------------------------------------------------------------ */
/*  FileInfoDialog (story-local composition)                           */
/* ------------------------------------------------------------------ */

function FileInfoDialog({
  isOpen,
  onOpenChange,
  file,
  fileHref,
  onDownload,
  onDelete,
}: FileInfoDialogProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsConfirmingDelete(false);
      }
      onOpenChange(open);
    },
    [onOpenChange],
  );

  const handleConfirmDelete = useCallback(() => {
    onDelete?.();
    setIsConfirmingDelete(false);
  }, [onDelete]);

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={file.name}
      size="md"
    >
      <DescriptionList layout="horizontal">
        <DescriptionList.Item label="Size">{file.size}</DescriptionList.Item>

        <DescriptionList.Item label="Last Modified">
          {file.lastModified}
        </DescriptionList.Item>

        {file.contentType && (
          <DescriptionList.Item label="Content Type">
            {file.contentType}
          </DescriptionList.Item>
        )}

        {file.storageClass && (
          <DescriptionList.Item label="Storage Class">
            {file.storageClass}
          </DescriptionList.Item>
        )}

        {file.etag && (
          <DescriptionList.Item
            label="ETag"
            muted
            fullValue={file.etag}
          >
            {truncate(file.etag, 12)}
          </DescriptionList.Item>
        )}

        {file.isVersioned && file.versionId && (
          <DescriptionList.Item
            label="Version ID"
            muted
            fullValue={file.versionId}
          >
            {truncate(file.versionId, 12)}
          </DescriptionList.Item>
        )}
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
          {fileHref ? (
            <ButtonLink href={fileHref} variant="secondary" size="md">
              Open File
            </ButtonLink>
          ) : (
            <div />
          )}
          {onDownload ? (
            <Button variant="primary" size="md" onPress={onDownload}>
              Download
            </Button>
          ) : (
            <div />
          )}
          {onDelete ? (
            <Button
              variant="destructive"
              size="md"
              onPress={() => setIsConfirmingDelete(true)}
            >
              Delete
            </Button>
          ) : (
            <div />
          )}
        </DialogFooter>
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const omeTiffFile: FileMetadata = {
  name: "case-2024-0193_HE.ome.tif",
  size: "2.4 GB",
  lastModified: "2026-02-18 14:32 UTC",
  contentType: "image/tiff",
  storageClass: "STANDARD",
  etag: "a3f8c91b2d4e6f7a8b9c0d1e2f3a4b5c",
  versionId: "v8Kj2mNpQ3xYz1aBcDeFgHiJkLmNoP",
  isVersioned: true,
};

const csvFile: FileMetadata = {
  name: "analysis-results.csv",
  size: "1.2 MB",
  lastModified: "2026-03-01 09:15 UTC",
  contentType: "text/csv",
  storageClass: "STANDARD",
  etag: "b7c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9",
  isVersioned: false,
};

const glacierFile: FileMetadata = {
  name: "archived-sample-042.ome.tif",
  size: "45.1 GB",
  lastModified: "2025-06-12 08:00 UTC",
  contentType: "image/tiff",
  storageClass: "GLACIER",
  etag: "f1e2d3c4b5a6978869a0b1c2d3e4f5a6",
  isVersioned: false,
};

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/FileInfoDialog",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <FileInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          file={omeTiffFile}
          fileHref="/viewer/case-2024-0193_HE.ome.tif"
          onDownload={fn()}
          onDelete={fn()}
        />
      </>
    );
  },
};

export const NonVersioned: Story = {
  name: "Non-Versioned File",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <FileInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          file={csvFile}
          fileHref="/viewer/analysis-results.csv"
          onDownload={fn()}
          onDelete={fn()}
        />
      </>
    );
  },
};

export const GlacierStorage: Story = {
  name: "Glacier Storage Class",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <FileInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          file={glacierFile}
          onDownload={fn()}
          onDelete={fn()}
        />
      </>
    );
  },
};

export const DeleteConfirmation: Story = {
  name: "Delete Confirmation",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <FileInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          file={omeTiffFile}
          fileHref="/viewer/case-2024-0193_HE.ome.tif"
          onDownload={fn()}
          onDelete={fn()}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const deleteButton = await canvas.findByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);

    await expect(
      canvas.getByText("Are you sure you want to delete this file?"),
    ).toBeInTheDocument();

    await expect(
      canvas.getByRole("button", { name: "Yes, Delete File" }),
    ).toBeInTheDocument();
  },
};

export const CancelDelete: Story = {
  name: "Cancel Delete Returns to Default",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <FileInfoDialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          file={omeTiffFile}
          fileHref="/viewer/case-2024-0193_HE.ome.tif"
          onDownload={fn()}
          onDelete={fn()}
        />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const deleteButton = await canvas.findByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);
    await expect(
      canvas.getByText("Are you sure you want to delete this file?"),
    ).toBeInTheDocument();

    const cancelButton = canvas.getByRole("button", { name: "Cancel" });
    await userEvent.click(cancelButton);

    await expect(
      canvas.getByRole("button", { name: "Delete" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Download" }),
    ).toBeInTheDocument();
  },
};
