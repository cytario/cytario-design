import type { Meta, StoryObj } from "storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  argTypes: {
    variant: {
      control: "select",
      options: ["brand", "success", "warning", "danger", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    showValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// --- The canonical visual reference: every variant stacked ---

const variants = ["brand", "success", "warning", "danger", "neutral"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "400px" }}>
      {variants.map((variant) => (
        <ProgressBar key={variant} value={65} variant={variant} label={variant} />
      ))}
    </div>
  ),
};

// --- Boundary values ---

export const Empty: Story = {
  args: { value: 0, label: "Empty" },
};

export const Full: Story = {
  args: { value: 100, label: "Complete" },
};

// --- With description ---

export const WithDescription: Story = {
  args: {
    value: 78,
    label: "Tagging Coverage",
    description: "78% tagged ($15,200) -- $4,300 untagged",
  },
};

// --- Without value display ---

export const HiddenValue: Story = {
  args: { value: 60, label: "Processing", showValue: false },
};

// --- Playground (variant × size combos live here) ---

export const Playground: Story = {
  args: {
    value: 50,
    variant: "brand",
    size: "md",
    label: "Playground",
    showValue: true,
  },
};
