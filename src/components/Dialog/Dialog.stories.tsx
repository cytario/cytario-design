import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Dialog } from "./Dialog";
import { DialogFooter } from "./DialogFooter";
import { Button } from "../Button";
import { ButtonLink } from "../ButtonLink";
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

// --- Real-world usage stories (from cytario-web) ---

export const NodeInfoBucket: Story = {
  name: "Node Info: Bucket",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show Bucket Info</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <DescriptionList>
            <DescriptionList.Item label="Provider">AWS</DescriptionList.Item>
            <DescriptionList.Item label="Region">
              eu-central-1
            </DescriptionList.Item>
            <DescriptionList.Item label="S3 URI">
              <span>
                <span className="text-(--color-text-secondary)">
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
        </Dialog>
      </>
    );
  },
  args: {
    title: "my-pathology-data",
    size: "md",
  },
};

export const NodeInfoFile: Story = {
  name: "Node Info: File",
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Show File Info</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
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
        </Dialog>
      </>
    );
  },
  args: {
    title: "slide-001.ome.tif",
    size: "md",
  },
};

// --- Generic stories ---

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>This is the dialog body content.</p>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Dialog Title",
    size: "md",
  },
};

export const Small: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Small Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>A smaller dialog for confirmations.</p>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Confirm Action",
    size: "sm",
  },
};

export const Large: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Large Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>
            This is a larger dialog suitable for forms or detailed content. It
            provides more horizontal space for complex layouts.
          </p>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Edit Details",
    size: "lg",
  },
};

export const ExtraLarge: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open XL Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>An extra-large dialog for data-heavy views.</p>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Data View",
    size: "xl",
  },
};

export const WithFooter: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>Are you sure you want to continue?</p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setIsOpen(false)}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Confirmation",
    size: "sm",
  },
};

export const CloseInteraction: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
          <p>Click the close button to dismiss.</p>
        </Dialog>
      </>
    );
  },
  args: {
    title: "Close Me",
    size: "md",
  },
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body;
    const canvas = within(body);

    const closeButton = await canvas.findByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    // Dialog should be gone
    await expect(canvas.queryByRole("dialog")).toBeNull();
  },
};
