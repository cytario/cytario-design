import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    delay: { control: "number" },
  },
  args: {
    content: "Tooltip text",
  },
  // Center stories so tooltips have room to render in all directions
  decorators: [
    (Story) => (
      <div style={{ padding: "100px", display: "flex", justifyContent: "center" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// --- Placement stories ---

export const Top: Story = {
  args: {
    content: "Tooltip on top",
    placement: "top",
    children: <Button>Hover me</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: "Tooltip on bottom",
    placement: "bottom",
    children: <Button>Hover me</Button>,
  },
};

export const Left: Story = {
  args: {
    content: "Tooltip on left",
    placement: "left",
    children: <Button>Hover me</Button>,
  },
};

export const Right: Story = {
  args: {
    content: "Tooltip on right",
    placement: "right",
    children: <Button>Hover me</Button>,
  },
};

// --- Custom delay ---

export const CustomDelay: Story = {
  args: {
    content: "Appears after 1 second",
    delay: 1000,
    children: <Button>Slow tooltip</Button>,
  },
};

// --- Long content ---

export const LongContent: Story = {
  args: {
    content:
      "This is a longer tooltip that demonstrates how the max-width constraint keeps the tooltip readable.",
    children: <Button>Long tooltip</Button>,
  },
};

// --- All placements grid ---

const placements = ["top", "bottom", "left", "right"] as const;

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
      {placements.map((placement) => (
        <Tooltip key={placement} content={`Tooltip ${placement}`} placement={placement}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

// --- Interaction test ---

export const FocusInteraction: Story = {
  args: {
    content: "Visible on focus",
    delay: 0,
    children: <Button>Focus me</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Focus me" });

    // Focus the trigger to show tooltip
    await userEvent.tab();
    await expect(button).toHaveFocus();

    // Tooltip should appear
    const tooltip = await canvas.findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Visible on focus");
  },
};
