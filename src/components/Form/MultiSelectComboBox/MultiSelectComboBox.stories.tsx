import type { Meta, StoryObj } from "storybook/react";
import { useState } from "react";

import { MultiSelectComboBox } from "./MultiSelectComboBox";

const meta = {
  title: "Components/Form/MultiSelectComboBox",
  component: MultiSelectComboBox,
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof MultiSelectComboBox>;

export default meta;
type Story = StoryObj<typeof MultiSelectComboBox>;

const GROUPS = [
  { id: "customers/vericura", name: "customers/vericura" },
  { id: "customers/acme", name: "customers/acme" },
  { id: "lab/team-a", name: "lab/team-a" },
];

export const Playground: Story = {
  args: {
    label: "Groups",
    items: GROUPS,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["customers/vericura"]);
    return (
      <MultiSelectComboBox
        label="Groups"
        items={GROUPS}
        value={value}
        onChange={(keys) => setValue(keys)}
      />
    );
  },
};
