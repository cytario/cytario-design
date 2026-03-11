import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { LayoutGrid, Grid3x3, List, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { ToggleButtonGroup, ToggleButtonGroupItem } from "./ToggleButtonGroup";

const meta: Meta<typeof ToggleButtonGroup> = {
  title: "Components/ToggleButtonGroup",
  component: ToggleButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <ToggleButtonGroup defaultValue="grid-lg" aria-label="View mode">
      <ToggleButtonGroupItem value="grid-lg" aria-label="Large grid" isIconOnly>
        <LayoutGrid size={16} />
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="grid-sm" aria-label="Small grid" isIconOnly>
        <Grid3x3 size={16} />
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="list" aria-label="List view" isIconOnly>
        <List size={16} />
      </ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ),
};

export const TextLabels: Story = {
  render: () => (
    <ToggleButtonGroup defaultValue="monthly" aria-label="Billing period">
      <ToggleButtonGroupItem value="monthly">Monthly</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="yearly">Yearly</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ),
};

export const TextAlignment: Story = {
  name: "Text Alignment (Icon)",
  render: () => (
    <ToggleButtonGroup defaultValue="left" aria-label="Text alignment">
      <ToggleButtonGroupItem value="left" aria-label="Align left" isIconOnly>
        <AlignLeft size={16} />
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="center" aria-label="Align center" isIconOnly>
        <AlignCenter size={16} />
      </ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="right" aria-label="Align right" isIconOnly>
        <AlignRight size={16} />
      </ToggleButtonGroupItem>
    </ToggleButtonGroup>
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
          <ToggleButtonGroup
            size={size}
            defaultValue="monthly"
            aria-label={`Billing period ${size}`}
          >
            <ToggleButtonGroupItem value="monthly">Monthly</ToggleButtonGroupItem>
            <ToggleButtonGroupItem value="yearly">Yearly</ToggleButtonGroupItem>
          </ToggleButtonGroup>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleButtonGroup
      defaultValue="monthly"
      isDisabled
      aria-label="Billing period"
    >
      <ToggleButtonGroupItem value="monthly">Monthly</ToggleButtonGroupItem>
      <ToggleButtonGroupItem value="yearly">Yearly</ToggleButtonGroupItem>
    </ToggleButtonGroup>
  ),
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState("grid-lg");

    return (
      <div className="flex flex-col gap-4">
        <ToggleButtonGroup
          value={value}
          onChange={setValue}
          aria-label="View mode"
        >
          <ToggleButtonGroupItem value="grid-lg" aria-label="Large grid" isIconOnly>
            <LayoutGrid size={16} />
          </ToggleButtonGroupItem>
          <ToggleButtonGroupItem value="grid-sm" aria-label="Small grid" isIconOnly>
            <Grid3x3 size={16} />
          </ToggleButtonGroupItem>
          <ToggleButtonGroupItem value="list" aria-label="List view" isIconOnly>
            <List size={16} />
          </ToggleButtonGroupItem>
        </ToggleButtonGroup>
        <p className="text-sm text-(--color-text-secondary)">
          Selected: {value}
        </p>
      </div>
    );
  },
};
