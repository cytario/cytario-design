import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { InlineConfirmation } from "./InlineConfirmation";
import { Dialog } from "../Dialog";
import { Button } from "../Button";

const meta: Meta<typeof InlineConfirmation> = {
  title: "Components/InlineConfirmation",
  component: InlineConfirmation,
};

export default meta;
type Story = StoryObj<typeof InlineConfirmation>;

export const DangerDefault: Story = {
  name: "Danger (Default)",
  args: {
    message: "Are you sure you want to delete this file?",
    description: "This action cannot be undone.",
    confirmLabel: "Yes, Delete File",
    cancelLabel: "Cancel",
    variant: "danger",
    onConfirm: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="relative bg-(--color-surface-default) p-6 rounded-lg max-w-lg">
        <p className="text-sm text-(--color-text-primary) mb-0">
          Some dialog body content above the confirmation.
        </p>
        <Story />
      </div>
    ),
  ],
};

export const WithoutDescription: Story = {
  name: "Without Description",
  args: {
    message: "Remove this connection?",
    confirmLabel: "Remove",
    cancelLabel: "Keep",
    variant: "danger",
    onConfirm: fn(),
    onCancel: fn(),
  },
  decorators: [
    (Story) => (
      <div className="relative bg-(--color-surface-default) p-6 rounded-lg max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export const InsideDialog: Story = {
  name: "Inside a Dialog",
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open Dialog</Button>
        <Dialog
          isOpen={isOpen}
          onOpenChange={(open) => {
            if (!open) setIsConfirming(false);
            setIsOpen(open);
          }}
          title="File Details"
          size="md"
        >
          <p className="text-sm text-(--color-text-primary)">
            case-2024-0193_HE.ome.tif
          </p>
          {isConfirming ? (
            <InlineConfirmation
              message="Are you sure you want to delete this file?"
              description="This action cannot be undone."
              confirmLabel="Yes, Delete File"
              onConfirm={() => {
                setIsConfirming(false);
                setIsOpen(false);
              }}
              onCancel={() => setIsConfirming(false)}
            />
          ) : (
            <div className="pt-4 mt-4 border-t border-(--color-border-default) flex items-center justify-between gap-3">
              <Button variant="ghost" size="md">
                Download
              </Button>
              <Button
                variant="destructive"
                size="md"
                onPress={() => setIsConfirming(true)}
              >
                Delete
              </Button>
            </div>
          )}
        </Dialog>
      </>
    );
  },
};
