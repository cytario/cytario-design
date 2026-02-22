import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Dialog } from "./Dialog";
import { Button } from "../Button";
import { ButtonLink } from "../ButtonLink";

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
          <div className="flex flex-row gap-4 justify-between">
            <ButtonLink
              href="/buckets/aws/my-pathology-data"
              variant="secondary"
              size="lg"
            >
              Open bucket
            </ButtonLink>
            <Button type="submit" variant="destructive" size="lg">
              Remove Data Connection
            </Button>
          </div>
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
          <div className="flex flex-row gap-4 justify-between">
            <ButtonLink
              href="/buckets/aws/my-bucket/slide-001.ome.tif"
              variant="secondary"
              size="lg"
            >
              Open file
            </ButtonLink>
            <Button size="lg" isDisabled>
              Download file
            </Button>
          </div>
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
          <p className="mb-4">Are you sure you want to continue?</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
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
