import type { Meta, StoryObj } from "storybook/react";
import { DeltaIndicator } from "./DeltaIndicator";

const meta: Meta<typeof DeltaIndicator> = {
  title: "Components/DeltaIndicator",
  component: DeltaIndicator,
  argTypes: {
    format: {
      control: "select",
      options: ["currency", "percentage", "combined"],
    },
    mode: {
      control: "select",
      options: ["inline", "pill"],
    },
    reverseColor: { control: "boolean" },
    unavailable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DeltaIndicator>;

// --- Direction stories ---

export const Increase: Story = {
  args: { current: 12450, previous: 11150 },
};

export const Decrease: Story = {
  args: { current: 9800, previous: 11150 },
};

export const Flat: Story = {
  args: { current: 11150, previous: 11150 },
};

// --- Format stories ---

export const CurrencyFormat: Story = {
  args: { current: 12450, previous: 11150, format: "currency" },
};

export const PercentageFormat: Story = {
  args: { current: 12450, previous: 11150, format: "percentage" },
};

export const CombinedFormat: Story = {
  args: { current: 12450, previous: 11150, format: "combined" },
};

// --- With label ---

export const WithMomLabel: Story = {
  name: "With MoM Label",
  args: { current: 12450, previous: 11150, label: "MoM" },
};

export const WithYoyLabel: Story = {
  name: "With YoY Label",
  args: { current: 12450, previous: 14200, label: "YoY" },
};

// --- Reverse color (higher is better) ---

export const ReverseColorIncrease: Story = {
  name: "Reverse Color: Increase",
  args: { current: 12450, previous: 11150, reverseColor: true },
};

export const ReverseColorDecrease: Story = {
  name: "Reverse Color: Decrease",
  args: { current: 9800, previous: 11150, reverseColor: true },
};

// --- Unavailable ---

export const Unavailable: Story = {
  args: { current: 0, previous: 0, unavailable: true },
};

export const UnavailableWithLabel: Story = {
  args: { current: 0, previous: 0, unavailable: true, label: "YoY", unavailableText: "N/A (MTD)" },
};

// --- Edge cases ---

export const NewItem: Story = {
  name: "New (previous = 0)",
  args: { current: 1200, previous: 0 },
};

export const SmallChange: Story = {
  args: { current: 100.5, previous: 100.0, format: "combined" },
};

// --- Dapanoskop usage ---

export const DashboardMom: Story = {
  name: "dapanoskop: Dashboard MoM",
  args: { current: 22100, previous: 20800, label: "MoM" },
};

export const DashboardYoy: Story = {
  name: "dapanoskop: Dashboard YoY",
  args: { current: 22100, previous: 18500, label: "YoY" },
};

export const CostCenterMom: Story = {
  name: "dapanoskop: Cost Center MoM",
  args: { current: 12450, previous: 11150, label: "MoM" },
};

export const CostCenterYoyMtd: Story = {
  name: "dapanoskop: Cost Center YoY (MTD)",
  args: { current: 0, previous: 0, unavailable: true, label: "YoY", unavailableText: "N/A (MTD)" },
};

// --- Pill mode ---

export const PillIncrease: Story = {
  name: "Pill: Increase",
  args: { current: 12450, previous: 11150, mode: "pill" },
};

export const PillDecrease: Story = {
  name: "Pill: Decrease",
  args: { current: 9800, previous: 11150, mode: "pill" },
};

export const PillFlat: Story = {
  name: "Pill: Flat",
  args: { current: 11150, previous: 11150, mode: "pill" },
};

// --- Inline composition ---

export const InlineComposition: Story = {
  name: "Inline Composition",
  render: () => (
    <div className="flex items-center gap-6 text-sm">
      <DeltaIndicator current={12450} previous={11150} label="MoM" />
      <DeltaIndicator current={12450} previous={14200} label="YoY" />
      <DeltaIndicator current={0} previous={0} unavailable label="QoQ" />
    </div>
  ),
};
