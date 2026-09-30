import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
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
      options: ["xs", "sm", "md", "lg"],
    },
    defaultSelected: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isSquare: { control: "boolean" },
  },
  args: {
    children: "Toggle",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

// --- The canonical visual reference: each variant resting and selected ---

const variants = ["default", "primary", "outlined"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <ToggleButton variant={variant}>{variant}</ToggleButton>
          <ToggleButton variant={variant} defaultSelected>
            {variant} selected
          </ToggleButton>
        </div>
      ))}
    </div>
  ),
};

// --- Square icon toggles (segmented-style group) ---

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

// --- Interaction test ---

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

// --- Playground (sizes, disabled, square live here) ---

export const Playground: Story = {
  args: {
    variant: "default",
    size: "md",
    isSquare: false,
    children: "Playground",
  },
};
