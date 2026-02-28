import type { Meta, StoryObj } from "storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    interactive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// --- Basic stories ---

export const Default: Story = {
  args: {
    children: "This is a basic card with default padding.",
  },
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    children: "Card with small padding.",
  },
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    children: "Card with large padding.",
  },
};

export const NoPadding: Story = {
  args: {
    padding: "none",
    children: (
      <div className="p-4">Content manages its own padding when card padding is none.</div>
    ),
  },
};

// --- With header and footer ---

export const WithHeader: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between">
        <span className="font-[number:var(--font-weight-semibold)]">Card Title</span>
        <span className="text-sm text-[var(--color-text-secondary)]">Action</span>
      </div>
    ),
    children: "Card body content goes here.",
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    header: (
      <span className="font-[number:var(--font-weight-semibold)]">Card Title</span>
    ),
    children: "Card body content with both header and footer.",
    footer: (
      <div className="flex justify-end gap-2 text-sm text-[var(--color-text-secondary)]">
        Footer content
      </div>
    ),
  },
};

// --- Interactive ---

export const Interactive: Story = {
  args: {
    interactive: true,
    children: "Hover me — I have a shadow transition.",
  },
};

export const AsLink: Story = {
  args: {
    href: "#",
    children: "I am a clickable card link.",
  },
};

// --- Dapanoskop usage ---

export const CostCenterContainer: Story = {
  name: "dapanoskop: Cost Center Card",
  args: {
    padding: "md",
    interactive: true,
    children: (
      <div>
        <div className="flex items-center justify-between">
          <span className="font-[number:var(--font-weight-semibold)]">Engineering</span>
          <span className="text-[length:var(--font-size-xl)] font-[number:var(--font-weight-semibold)]">
            $12,450
          </span>
        </div>
        <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
          12 workloads
        </div>
      </div>
    ),
  },
};

export const TableContainer: Story = {
  name: "dapanoskop: Table Container",
  args: {
    padding: "none",
    header: (
      <div className="p-4">
        <span className="font-[number:var(--font-weight-semibold)]">Workload Breakdown</span>
      </div>
    ),
    children: (
      <div className="border-t border-[var(--color-border-default)]">
        <div className="px-4 py-2 text-sm text-[var(--color-text-secondary)]">
          Table content would go here
        </div>
      </div>
    ),
  },
};

// --- All paddings ---

const paddings = ["none", "sm", "md", "lg"] as const;

export const AllPaddings: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {paddings.map((p) => (
        <Card key={p} padding={p}>
          padding=&quot;{p}&quot;
        </Card>
      ))}
    </div>
  ),
};
