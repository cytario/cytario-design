import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Dialog } from "./Dialog";
import { DialogFooter } from "./DialogFooter";
import { Button } from "../Button";
import { ButtonLink } from "../Button";
import { DescriptionList } from "../DescriptionList";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/** Open-state boilerplate shared by every story: a reopen button + the dialog. */
function OpenDialog({
  title,
  children,
  isOpen,
  onOpenChange,
  ...args
}: {
  title: string;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & Record<string, unknown>) {
  const [internalOpen, setInternalOpen] = useState(true);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  return (
    <>
      <Button onPress={() => setOpen(true)}>Reopen dialog</Button>
      <Dialog {...args} title={title} isOpen={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </>
  );
}

// --- Sizes (same content; the size arg is the story) ---

export const Sizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<string | null>(null);
    return (
      <div className="flex flex-wrap gap-3">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <OpenDialog
            key={size}
            title={`${size} dialog`}
            size={size}
            isOpen={openSize === size}
            onOpenChange={(open) => setOpenSize(open ? size : null)}
          >
            <p>
              A {size} dialog. Use the buttons to compare sizes; only one is
              open at a time.
            </p>
          </OpenDialog>
        ))}
      </div>
    );
  },
};

// --- Real-world usage (from cytario-web) ---

export const NodeInfoBucket: Story = {
  name: "Node Info: Bucket",
  render: () => (
    <OpenDialog title="my-pathology-data" size="md">
      <DescriptionList>
        <DescriptionList.Item label="Provider">AWS</DescriptionList.Item>
        <DescriptionList.Item label="Region">
          eu-central-1
        </DescriptionList.Item>
        <DescriptionList.Item label="S3 URI">
          <span>
            <span className="text-muted-foreground">
              s3://
            </span>
            my-pathology-data/slides/
          </span>
        </DescriptionList.Item>
      </DescriptionList>
      <DialogFooter>
        <ButtonLink
          href="/buckets/aws/my-pathology-data"
          variant="secondary"
          size="md"
        >
          Open bucket
        </ButtonLink>
        <Button type="submit" variant="destructive" size="md">
          Remove Data Connection
        </Button>
      </DialogFooter>
    </OpenDialog>
  ),
};

export const NodeInfoFile: Story = {
  name: "Node Info: File",
  render: () => (
    <OpenDialog title="slide-001.ome.tif" size="md">
      <DescriptionList layout="horizontal">
        <DescriptionList.Item label="Size">2.4 GB</DescriptionList.Item>
        <DescriptionList.Item label="Last Modified">
          2026-02-18 14:32 UTC
        </DescriptionList.Item>
        <DescriptionList.Item label="Content Type">
          image/tiff
        </DescriptionList.Item>
      </DescriptionList>
      <DialogFooter>
        <ButtonLink
          href="/buckets/aws/my-bucket/slide-001.ome.tif"
          variant="secondary"
          size="md"
        >
          Open file
        </ButtonLink>
        <Button size="md" isDisabled>
          Download file
        </Button>
      </DialogFooter>
    </OpenDialog>
  ),
};

// --- With footer (confirmation pattern) ---

export const WithFooter: Story = {
  render: () => (
    <OpenDialog title="Confirmation" size="sm">
      <p>Are you sure you want to continue?</p>
      <DialogFooter>
        <Button variant="secondary">
          Cancel
        </Button>
        <Button variant="primary">
          Confirm
        </Button>
      </DialogFooter>
    </OpenDialog>
  ),
};

// --- Interaction test ---

export const CloseInteraction: Story = {
  render: () => (
    <OpenDialog title="Close Me" size="md">
      <p>Click the close button to dismiss.</p>
    </OpenDialog>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const closeButton = await canvas.findByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    // Dialog should be gone
    await expect(canvas.queryByRole("dialog")).toBeNull();
  },
};
