import type { Meta, StoryObj } from "storybook/react";
import { PathPill } from "./PathPill";

const meta: Meta<typeof PathPill> = {
  title: "Components/Pill/PathPill",
  component: PathPill,
  argTypes: {
    children: { control: "text" },
    visibleCount: { control: { type: "number", min: 0, max: 10 } },
  },
  args: { children: "/cytario/engineering/frontend" },
};

export default meta;
type Story = StoryObj<typeof PathPill>;

export const Default: Story = {};
