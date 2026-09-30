import type { Meta, StoryObj } from "storybook/react";
import { MetricCard } from "./MetricCard";

const meta: Meta<typeof MetricCard> = {
  title: "Components/MetricCard",
  component: MetricCard,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

// --- Basic stories ---

export const Default: Story = {
  args: {
    label: "Total Spend",
    value: "$22,100",
  },
};

export const WithSecondary: Story = {
  args: {
    label: "Total Spend",
    value: "$22,100",
    secondary: "12 workloads across 3 cost centers",
  },
};

// --- Size stories ---

export const Small: Story = {
  args: {
    size: "sm",
    label: "Cost / TB",
    value: "$23.50",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
// --- Grid composition ---

export const MetricCardRow: Story = {
  name: "Composition: 3-Column Grid",
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Total Spend"
        value="$22,100"
        secondary="12 workloads across 3 cost centers"
      />
      <MetricCard
        label="vs Last Month"
        value="+$1,300 (+6.2%)"
      />
      <MetricCard
        label="vs Last Year"
        value="+$3,600 (+19.7%)"
      />
    </div>
  ),
};

export const StorageMetrics: Story = {
  name: "Composition: 4-Column Storage Grid",
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <MetricCard
        label="Storage Cost"
        value="$4,500"
        href="#"
        secondary="+$300 vs last month"
      />
      <MetricCard
        label="Total Stored"
        value="192 TB"
        href="#"
      />
      <MetricCard label="Cost / TB" value="$23.50" size="sm" />
      <MetricCard label="Hot Tier" value="62%" size="sm" />
    </div>
  ),
};
