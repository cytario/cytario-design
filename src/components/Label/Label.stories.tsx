import type { Meta, StoryObj } from "storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  argTypes: {
    isRequired: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: "Patient name" },
};

export const Required: Story = {
  args: { children: "Email address", isRequired: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Label>Standard label</Label>
      <Label isRequired>Required label</Label>
    </div>
  ),
};
