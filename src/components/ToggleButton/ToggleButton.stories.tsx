import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ToggleButton } from "./ToggleButton";

const meta: Meta<typeof ToggleButton> = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Toggle",
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: { variant: "default", children: "Default Toggle" },
};

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Toggle" },
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
    children: "Playground",
  },
};
