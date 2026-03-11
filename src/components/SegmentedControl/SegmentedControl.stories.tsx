import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { LayoutGrid, Grid3x3, List } from "lucide-react";
import { SegmentedControl, SegmentedControlItem } from "./SegmentedControl";
import type { Key } from "react-aria-components";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  name: "Icon Toggle (Single)",
  render: () => (
    <SegmentedControl
      defaultSelectedKeys={["grid-lg"]}
      selectionMode="single"
      aria-label="View mode"
    >
      <SegmentedControlItem id="grid-lg" aria-label="Large grid">
        <LayoutGrid size={16} />
      </SegmentedControlItem>
      <SegmentedControlItem id="grid-sm" aria-label="Small grid">
        <Grid3x3 size={16} />
      </SegmentedControlItem>
      <SegmentedControlItem id="table" aria-label="Table view">
        <List size={16} />
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const TextLabels: Story = {
  render: () => (
    <SegmentedControl
      defaultSelectedKeys={["20x"]}
      selectionMode="single"
      aria-label="Magnification"
    >
      <SegmentedControlItem id="5x">5x</SegmentedControlItem>
      <SegmentedControlItem id="10x">10x</SegmentedControlItem>
      <SegmentedControlItem id="20x">20x</SegmentedControlItem>
      <SegmentedControlItem id="40x">40x</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const NoSelection: Story = {
  name: "No Selection (Action Buttons)",
  render: () => (
    <SegmentedControl
      selectionMode="none"
      aria-label="Zoom presets"
    >
      <SegmentedControlItem id="5x" onPress={fn()}>
        5x
      </SegmentedControlItem>
      <SegmentedControlItem id="10x" onPress={fn()}>
        10x
      </SegmentedControlItem>
      <SegmentedControlItem id="20x" onPress={fn()}>
        20x
      </SegmentedControlItem>
      <SegmentedControlItem id="40x" onPress={fn()}>
        40x
      </SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SegmentedControl
      defaultSelectedKeys={["10x"]}
      selectionMode="single"
      isDisabled
      aria-label="Magnification"
    >
      <SegmentedControlItem id="5x">5x</SegmentedControlItem>
      <SegmentedControlItem id="10x">10x</SegmentedControlItem>
      <SegmentedControlItem id="20x">20x</SegmentedControlItem>
      <SegmentedControlItem id="40x">40x</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-sm text-(--color-text-secondary)">
            {size}
          </span>
          <SegmentedControl
            size={size}
            defaultSelectedKeys={["20x"]}
            selectionMode="single"
            aria-label={`Magnification ${size}`}
          >
            <SegmentedControlItem id="5x">5x</SegmentedControlItem>
            <SegmentedControlItem id="10x">10x</SegmentedControlItem>
            <SegmentedControlItem id="20x">20x</SegmentedControlItem>
            <SegmentedControlItem id="40x">40x</SegmentedControlItem>
          </SegmentedControl>
        </div>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [selected, setSelected] = useState<Set<Key>>(new Set(["grid-lg"]));

    return (
      <div className="flex flex-col gap-4">
        <SegmentedControl
          selectedKeys={selected}
          onSelectionChange={setSelected}
          selectionMode="single"
          aria-label="View mode"
        >
          <SegmentedControlItem id="grid-lg" aria-label="Large grid">
            <LayoutGrid size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="grid-sm" aria-label="Small grid">
            <Grid3x3 size={16} />
          </SegmentedControlItem>
          <SegmentedControlItem id="table" aria-label="Table view">
            <List size={16} />
          </SegmentedControlItem>
        </SegmentedControl>
        <p className="text-sm text-(--color-text-secondary)">
          Selected: {[...selected].join(", ") || "none"}
        </p>
      </div>
    );
  },
};
