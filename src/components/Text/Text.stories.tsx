import type { Meta, StoryObj } from "storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    as: {
      control: "select",
      options: ["p", "span", "div", "label", "small", "strong"],
    },
    variant: {
      control: "select",
      options: [
        "body",
        "small",
        "muted",
        "caption",
        "eyebrow",
        "eyebrow-bold",
      ],
    },
    weight: {
      control: "select",
      options: ["regular", "medium", "semibold", "bold"],
    },
  },
  args: {
    children: "Text",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text variant="body">body — base size, foreground</Text>
      <Text variant="small">small — small size, foreground</Text>
      <Text variant="muted">muted — small size, muted-foreground</Text>
      <Text variant="caption">caption — xs size, muted-foreground</Text>
      <Text variant="eyebrow">eyebrow — uppercase, tracking-wide</Text>
      <Text variant="eyebrow-bold">eyebrow-bold — uppercase, tracking-wider</Text>
    </div>
  ),
};

export const Playground: Story = {
  args: { as: "p", variant: "body", children: "Playground Text" },
};
