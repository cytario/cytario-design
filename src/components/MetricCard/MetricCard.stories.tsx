import type { Meta, StoryObj } from "storybook/react";
import { MetricCard } from "./MetricCard";
import { DeltaIndicator } from "../DeltaIndicator";

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

export const WithDelta: Story = {
  args: {
    label: "Total Spend",
    value: "$22,100",
    secondary: <DeltaIndicator current={22100} previous={20800} label="MoM" />,
  },
};

export const AsLink: Story = {
  args: {
    label: "Storage Cost",
    value: "$4,500",
    href: "#",
    secondary: <DeltaIndicator current={4500} previous={4200} />,
  },
};

// --- Grid compositions ---

export const MetricCardRow: Story = {
  name: "Composition: 3-Column Grid",
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Total Spend"
        value="$22,100"
        secondary={
          <DeltaIndicator current={22100} previous={20800} label="MoM" />
        }
      />
      <MetricCard
        label="vs Last Month"
        value={
          <DeltaIndicator
            current={22100}
            previous={20800}
            format="combined"
          />
        }
      />
      <MetricCard
        label="vs Last Year"
        value={
          <DeltaIndicator
            current={22100}
            previous={18500}
            format="combined"
          />
        }
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
        secondary={<DeltaIndicator current={4500} previous={4200} />}
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
