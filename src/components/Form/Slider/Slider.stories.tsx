import type { Meta, StoryObj } from "storybook/react";
import { useState } from "react";

import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Form/Slider",
  component: Slider,
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    isDisabled: { control: "boolean" },
    minValue: { control: "number" },
    maxValue: { control: "number" },
    step: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// --- Real-world usage stories (from compute-plugin's row editor, C-486) ---

export const JobMemory: Story = {
  name: "Job Memory (run form row editor)",
  args: {
    label: "Memory",
    minValue: 38,
    maxValue: 256,
    step: 2,
    defaultValue: 64,
    output: (v: number) => `${v} GiB`,
    description: "app min 8 GiB · min for this input 38 GiB (30.2 GB input) · max 256 GiB",
  },
};

export const JobScratch: Story = {
  name: "Job Scratch (run form row editor)",
  args: {
    label: "Scratch (ephemeral storage)",
    minValue: 80,
    maxValue: 200,
    step: 4,
    defaultValue: 96,
    output: (v: number) => `${v} GiB`,
    description: "app min 20 GiB · min for this input 80 GiB · max 200 GiB",
  },
};

export const MemoryAndScratch: Story = {
  name: "Memory + Scratch (row editor section)",
  render: () => {
    const [memory, setMemory] = useState(64);
    const [scratch, setScratch] = useState(96);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: 480 }}>
        <Slider
          label="Memory"
          minValue={38}
          maxValue={256}
          step={2}
          value={memory}
          onChange={setMemory}
          output={(v) => `${v} GiB`}
          description="app min 8 GiB · min for this input 38 GiB (30.2 GB input) · max 256 GiB"
        />
        <Slider
          label="Scratch (ephemeral storage)"
          minValue={80}
          maxValue={200}
          step={4}
          value={scratch}
          onChange={setScratch}
          output={(v) => `${v} GiB`}
          description="app min 20 GiB · min for this input 80 GiB · max 200 GiB"
        />
      </div>
    );
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: {
    label: "Memory",
    minValue: 8,
    maxValue: 256,
    step: 4,
    defaultValue: 32,
    output: (v: number) => `${v} GiB`,
    description: "app min 8 GiB · max 256 GiB",
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
        description="app min 20 GiB · max 200 GiB"
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
    output: (v: number) => `${v} GiB`,
  },
};

export const Invalid: Story = {
  args: {
    label: "Memory",
    minValue: 8,
    maxValue: 256,
    defaultValue: 8,
    errorMessage: "Below the application minimum",
    output: (v: number) => `${v} GiB`,
  },
};
