import type { Meta, StoryObj } from "storybook/react";
import { IconButtonToggle } from "./IconButton";

const meta: Meta<typeof IconButtonToggle> = {
  title: "Components/IconButtonToggle",
  component: IconButtonToggle,
  argTypes: {
    variant: { control: "select" },
    size: { control: "select" },
  },
  args: {
    icon: "PanelLeftClose",
    label: "Toggle panel",
    variant: "ghost",
  },
};

export default meta;
type Story = StoryObj<typeof IconButtonToggle>;

// `defaultSelected` lets react-aria manage the toggle so it flips on click.
export const Default: Story = {
  args: { defaultSelected: false },
};

export const Selected: Story = {
  args: { defaultSelected: true },
};
