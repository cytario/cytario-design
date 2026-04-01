import type { Meta, StoryObj } from "storybook/react";
import { Pill } from "./Pill";

const meta: Meta<typeof Pill> = {
  title: "Components/Pill/Pill",
  component: Pill,
  argTypes: {
    children: { control: "text" },
    color: {
      control: "select",
      options: [undefined, "purple", "teal", "rose", "green", "amber", "slate"],
    },
  },
  args: { children: "Engineering" },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {};
