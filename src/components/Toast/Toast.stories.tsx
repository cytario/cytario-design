import { useMemo } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ToastProvider, useToast, createToastBridge } from "./Toast";
import type { ToastPlacement } from "./Toast";
import { Button } from "../Button";

function ToastDemo({
  variant,
  message,
}: {
  variant: "success" | "error" | "info";
  message: string;
}) {
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

// --- All variants in one row ---

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-3">
      <ToastDemo variant="success" message="Overlay added: cells_detection.parquet" />
      <ToastDemo
        variant="error"
        message="Failed to load markers for cells_detection.parquet"
      />
      <ToastDemo
        variant="info"
        message="We couldn't load the objects for this bucket. Please check your connection or try again later."
      />
    </div>
  ),
};

// --- Interaction test ---

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

// --- Placement ---

function PlacementDemo({ placement }: { placement: ToastPlacement }) {
  const { toast } = useToast();
  return (
    <Button onPress={() => toast({ variant: "success", message: `Toast at ${placement}` })}>
      Show toast ({placement})
    </Button>
  );
}

export const Placement: Story = {
  render: () => (
    <div className="flex gap-3">
      <ToastProvider placement="top-center">
        <PlacementDemo placement="top-center" />
      </ToastProvider>
      <ToastProvider placement="top-right">
        <PlacementDemo placement="top-right" />
      </ToastProvider>
      <ToastProvider placement="bottom-center">
        <PlacementDemo placement="bottom-center" />
      </ToastProvider>
      {/* default: bottom-right */}
      <PlacementDemo placement="bottom-right" />
    </div>
  ),
};

// --- Bridge pattern (toast from outside React) ---

export const BridgePattern: Story = {
  decorators: [],
  render: () => {
    const bridge = useMemo(() => createToastBridge(), []);
    return (
      <ToastProvider bridge={bridge}>
        <div className="flex gap-3">
          <Button
            onPress={() =>
              bridge.emit({
                variant: "error",
                message: "Layer failed to load (via bridge)",
              })
            }
          >
            Emit via bridge
          </Button>
          <Button
            onPress={() =>
              bridge.emit({
                variant: "success",
                message: "Tile loaded (via bridge)",
              })
            }
          >
            Emit success via bridge
          </Button>
        </div>
      </ToastProvider>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Emit via bridge" });
    await userEvent.click(button);

    const body = canvasElement.ownerDocument.body;
    const bodyCanvas = within(body);
    const toast = await bodyCanvas.findByText(
      "Layer failed to load (via bridge)",
    );
    await expect(toast).toBeVisible();
  },
};
