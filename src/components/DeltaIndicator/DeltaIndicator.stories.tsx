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

// --- Direction (also the format/mode playground via the args table) ---

export const Increase: Story = {
  args: { current: 12450, previous: 11150 },
};

export const Decrease: Story = {
  args: { current: 9800, previous: 11150 },
};

export const Flat: Story = {
  args: { current: 11150, previous: 11150 },
};

// --- Options ---

export const WithLabel: Story = {
  args: { current: 12450, previous: 11150, label: "MoM" },
};

export const ReverseColor: Story = {
  args: { current: 12450, previous: 11150, reverseColor: true },
};

export const Pill: Story = {
  args: { current: 12450, previous: 11150, mode: "pill" },
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
