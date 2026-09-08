import type { Meta, StoryObj } from "storybook/react";
import { useState } from "react";

import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Form/Slider",
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    label: "Memory",
    minValue: 8,
    maxValue: 256,
    step: 4,
    defaultValue: 32,
    output: (v) => `${v} GiB`,
    description: "app floor 8 GiB · provider max 256 GiB",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(64);
    return (
      <Slider
        label="Scratch"
        minValue={20}
        maxValue={200}
        step={4}
        value={value}
        onChange={setValue}
        output={(v) => `${v} GiB`}
        description="app floor 20 GiB · provider max 200 GiB"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Memory",
    minValue: 8,
    maxValue: 256,
    defaultValue: 32,
    isDisabled: true,
    output: (v) => `${v} GiB`,
  },
};

export const Invalid: Story = {
  args: {
    label: "Memory",
    minValue: 8,
    maxValue: 256,
    defaultValue: 8,
    errorMessage: "Below the application floor",
    output: (v) => `${v} GiB`,
  },
};
