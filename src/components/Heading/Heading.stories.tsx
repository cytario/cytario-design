import type { Meta, StoryObj } from "storybook/react";
import { Heading, H1, H2, H3, H4, H5, H6 } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
      ],
    },
    weight: {
      control: "select",
      options: ["medium", "semibold", "bold"],
    },
  },
  args: {
    children: "Heading",
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <H1>H1 — page title (5xl, bold)</H1>
      <H2>H2 — section heading (3xl, bold)</H2>
      <H3>H3 — sub-heading (2xl, bold)</H3>
      <H4>H4 — sub-section (xl, semibold)</H4>
      <H5>H5 — minor heading (lg, semibold)</H5>
      <H6>H6 — smallest heading (sm, semibold)</H6>
    </div>
  ),
};

export const Playground: Story = {
  args: { as: "h2", size: "xl", weight: "semibold", children: "Playground Heading" },
};
