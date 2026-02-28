import type { Meta, StoryObj } from "storybook/react";
import { Cloud, AlertTriangle, CheckCircle, Tag } from "lucide-react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "purple", "teal", "rose", "slate", "green", "amber"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// --- Variant stories ---

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral" },
};

export const Purple: Story = {
  args: { variant: "purple", children: "Brand" },
};

export const Teal: Story = {
  args: { variant: "teal", children: "Accent" },
};

export const Rose: Story = {
  args: { variant: "rose", children: "Critical" },
};

export const Slate: Story = {
  args: { variant: "slate", children: "Split Charge" },
};

export const Green: Story = {
  args: { variant: "green", children: "Active" },
};

export const Amber: Story = {
  args: { variant: "amber", children: "MTD" },
};

// --- Size stories ---

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Medium: Story = {
  args: { size: "md", children: "Medium" },
};

// --- With icon ---

export const WithIcon: Story = {
  args: { variant: "teal", icon: Cloud, children: "AWS" },
};

export const WarningWithIcon: Story = {
  args: { variant: "amber", icon: AlertTriangle, children: "MTD" },
};

export const SuccessWithIcon: Story = {
  args: { variant: "green", icon: CheckCircle, children: "Active" },
};

// --- Dapanoskop usage stories ---

export const SplitCharge: Story = {
  name: "dapanoskop: Split Charge",
  args: { variant: "slate", children: "Split Charge" },
};

export const MtdLabel: Story = {
  name: "dapanoskop: MTD",
  args: { variant: "amber", icon: AlertTriangle, children: "MTD" },
};

export const ProviderAws: Story = {
  name: "dapanoskop: Provider AWS",
  args: { variant: "teal", icon: Cloud, children: "AWS" },
};

export const WorkloadCount: Story = {
  name: "dapanoskop: Workload Count",
  args: { variant: "neutral", icon: Tag, children: "12 workloads" },
};

// --- All variants grid ---

const variants = [
  "neutral",
  "purple",
  "teal",
  "rose",
  "slate",
  "green",
  "amber",
] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const AllVariantsMd: Story = {
  name: "All Variants (md)",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant} size="md">
          {variant}
        </Badge>
      ))}
    </div>
  ),
};
