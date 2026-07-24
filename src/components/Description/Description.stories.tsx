import type { Meta, StoryObj } from "storybook/react";
import { Description } from "./Description";

const meta: Meta<typeof Description> = {
  title: "Components/Description",
  component: Description,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
  args: {
    children:
      "Supporting copy beneath a heading. Use Description for lead text, section descriptions, and other non-heading prose.",
  },
};

export default meta;
type Story = StoryObj<typeof Description>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Description size="sm">
        sm — Supporting copy beneath a heading.
      </Description>
      <Description size="md">
        md — Supporting copy beneath a heading.
      </Description>
      <Description size="lg">
        lg — Supporting copy beneath a heading.
      </Description>
      <Description size="xl">
        xl — Supporting copy beneath a heading.
      </Description>
    </div>
  ),
};

export const Playground: Story = {
  args: { size: "md" },
  render: (args) => <Description {...args} />,
};
