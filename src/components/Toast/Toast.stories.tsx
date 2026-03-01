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

// --- Real-world usage stories (from cytario-web) ---

export const OverlayAdded: Story = {
  name: "Toast: Overlay Added",
  render: () => (
    <ToastDemo variant="success" message="Overlay added: cells_detection.parquet" />
  ),
};

export const OverlayFailed: Story = {
  name: "Toast: Overlay Load Failed",
  render: () => (
    <ToastDemo variant="error" message="Failed to load markers for cells_detection.parquet" />
  ),
};

export const ConnectionDeleted: Story = {
  name: "Toast: Data Connection Deleted",
  render: () => (
    <ToastDemo variant="success" message="Data connection deleted." />
  ),
};

export const ConversionStarted: Story = {
  name: "Toast: Conversion Started",
  render: () => (
    <ToastDemo variant="success" message="Started conversion: overlay.csv" />
  ),
};

export const LoadError: Story = {
  name: "Toast: Load Error",
  render: () => (
    <ToastDemo
      variant="error"
      message="We couldn't load the objects for this bucket. Please check your connection or try again later."
    />
  ),
};

// --- Generic stories ---

export const Success: Story = {
  render: () => (
    <ToastDemo variant="success" message="Changes saved successfully." />
  ),
};

export const Error: Story = {
  render: () => (
    <ToastDemo
      variant="error"
      message="Failed to save changes. Please try again."
    />
  ),
};

export const Info: Story = {
  render: () => (
    <ToastDemo variant="info" message="A new version is available." />
  ),
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

// --- Placement stories ---

function PlacementDemo({ placement }: { placement: ToastPlacement }) {
  const { toast } = useToast();
  return (
    <Button onPress={() => toast({ variant: "success", message: `Toast at ${placement}` })}>
      Show toast ({placement})
    </Button>
  );
}

export const TopCenter: Story = {
  name: "Placement: Top Center",
  decorators: [
    (Story) => (
      <ToastProvider placement="top-center">
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <PlacementDemo placement="top-center" />,
};

export const TopRight: Story = {
  name: "Placement: Top Right",
  decorators: [
    (Story) => (
      <ToastProvider placement="top-right">
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <PlacementDemo placement="top-right" />,
};

export const BottomCenter: Story = {
  name: "Placement: Bottom Center",
  decorators: [
    (Story) => (
      <ToastProvider placement="bottom-center">
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <PlacementDemo placement="bottom-center" />,
};

export const BottomRight: Story = {
  name: "Placement: Bottom Right (Default)",
  render: () => (
    <ToastDemo variant="success" message="Default bottom-right placement" />
  ),
};

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
