import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Grid2x2, Grid3x3, List, Square } from "lucide-react";
import { ToggleButton } from "./ToggleButton";

const meta: Meta<typeof ToggleButton> = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "outlined"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isDisabled: { control: "boolean" },
    isSquare: { control: "boolean" },
  },
  args: {
    children: "Toggle",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

// --- Real-world usage stories (from cytario-web) ---

export const ViewModeToggle: Story = {
  name: "View Mode Toggle",
  render: () => (
    <div style={{ display: "flex", gap: "4px" }}>
      <ToggleButton
        aria-label="List View"
        variant="outlined"
        isSquare
        size="sm"
        isSelected
        onChange={() => {}}
      >
        <List size={16} />
      </ToggleButton>
      <ToggleButton
        aria-label="Small Grid"
        variant="outlined"
        isSquare
        size="sm"
        onChange={() => {}}
      >
        <Grid3x3 size={16} />
      </ToggleButton>
      <ToggleButton
        aria-label="Medium Grid"
        variant="outlined"
        isSquare
        size="sm"
        onChange={() => {}}
      >
        <Grid2x2 size={16} />
      </ToggleButton>
      <ToggleButton
        aria-label="Large Grid"
        variant="outlined"
        isSquare
        size="sm"
        onChange={() => {}}
      >
        <Square size={16} />
      </ToggleButton>
    </div>
  ),
};

// --- Variant stories ---

export const Default: Story = {
  args: { variant: "default", children: "Default Toggle" },
};

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Toggle" },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Outlined Toggle" },
};

export const OutlinedSelected: Story = {
  args: {
    variant: "outlined",
    defaultSelected: true,
    children: "Outlined Selected",
  },
};

export const SquareOutlined: Story = {
  args: {
    variant: "outlined",
    isSquare: true,
    size: "md",
    children: "A",
  },
};

export const Selected: Story = {
  args: { variant: "default", defaultSelected: true, children: "Selected" },
};

export const PrimarySelected: Story = {
  args: { variant: "primary", defaultSelected: true, children: "Active" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: "Disabled" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <ToggleButton variant="default">Default</ToggleButton>
        <ToggleButton variant="default" defaultSelected>
          Default Selected
        </ToggleButton>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <ToggleButton variant="primary">Primary</ToggleButton>
        <ToggleButton variant="primary" defaultSelected>
          Primary Selected
        </ToggleButton>
      </div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <ToggleButton variant="outlined">Outlined</ToggleButton>
        <ToggleButton variant="outlined" defaultSelected>
          Outlined Selected
        </ToggleButton>
      </div>
    </div>
  ),
};

export const ToggleGroup: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0px" }}>
      <ToggleButton variant="outlined" isSquare size="md">
        A
      </ToggleButton>
      <ToggleButton variant="outlined" isSquare size="md">
        B
      </ToggleButton>
      <ToggleButton variant="outlined" isSquare size="md" defaultSelected>
        C
      </ToggleButton>
      <ToggleButton variant="outlined" isSquare size="md">
        D
      </ToggleButton>
    </div>
  ),
};

export const ToggleInteraction: Story = {
  args: { variant: "primary", children: "Click to toggle" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Click to toggle" });

    // Initially not pressed
    await expect(button).toHaveAttribute("aria-pressed", "false");

    // Click to toggle on
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");

    // Click to toggle off
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "false");
  },
};

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    isSquare: false,
    children: "Playground",
  },
};
