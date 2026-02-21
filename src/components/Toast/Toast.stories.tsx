import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../Button";

function ToastDemo({ variant, message }: { variant: "success" | "error" | "info"; message: string }) {
  const { toast } = useToast();
  return (
    <Button onPress={() => toast({ variant, message })}>
      Show {variant} toast
    </Button>
  );
}

const meta: Meta = {
  title: "Components/Toast",
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Success: Story = {
  render: () => <ToastDemo variant="success" message="Changes saved successfully." />,
};

export const Error: Story = {
  render: () => <ToastDemo variant="error" message="Failed to save changes. Please try again." />,
};

export const Info: Story = {
  render: () => <ToastDemo variant="info" message="A new version is available." />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3">
      <ToastDemo variant="success" message="Success!" />
      <ToastDemo variant="error" message="Error occurred." />
      <ToastDemo variant="info" message="Info message." />
    </div>
  ),
};

export const ClickInteraction: Story = {
  render: () => <ToastDemo variant="success" message="Toast appeared!" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);

    const body = canvasElement.ownerDocument.body;
    const bodyCanvas = within(body);
    const toast = await bodyCanvas.findByText("Toast appeared!");
    await expect(toast).toBeVisible();
  },
};
