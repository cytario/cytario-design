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

// --- Basic stories ---

export const Default: Story = {
  args: { value: 65, label: "Progress" },
};

export const Empty: Story = {
  args: { value: 0, label: "Empty" },
};

export const Full: Story = {
  args: { value: 100, label: "Complete" },
};

// --- Variant stories ---

export const Brand: Story = {
  args: { value: 72, variant: "brand", label: "Brand" },
};

export const Success: Story = {
  args: { value: 85, variant: "success", label: "Success" },
};

export const Warning: Story = {
  args: { value: 45, variant: "warning", label: "Warning" },
};

export const Danger: Story = {
  args: { value: 25, variant: "danger", label: "Danger" },
};

export const Neutral: Story = {
  args: { value: 50, variant: "neutral", label: "Neutral" },
};

// --- Size stories ---

export const Small: Story = {
  args: { value: 65, size: "sm", label: "Small bar" },
};

export const Medium: Story = {
  args: { value: 65, size: "md", label: "Medium bar" },
};

export const Large: Story = {
  args: { value: 65, size: "lg", label: "Large bar" },
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

// --- Dapanoskop usage ---

export const TaggingCoverage: Story = {
  name: "dapanoskop: Tagging Coverage",
  args: {
    value: 78,
    variant: "brand",
    label: "Tagging Coverage",
    description: "78% tagged ($15,200) -- $4,300 untagged",
  },
};

export const LowCoverage: Story = {
  name: "dapanoskop: Low Coverage Warning",
  args: {
    value: 32,
    variant: "warning",
    label: "Tagging Coverage",
    description: "32% tagged ($6,400) -- $13,600 untagged",
  },
};

// --- All variants grid ---

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

// --- Playground ---

export const Playground: Story = {
  args: {
    value: 50,
    variant: "brand",
    size: "md",
    label: "Playground",
    showValue: true,
  },
};
