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
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "hero"],
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
      <H1>H1 — page title (4xl→5xl, bold)</H1>
      <H2>H2 — section heading (2xl→3xl, bold)</H2>
      <H3>H3 — sub-heading (lg→xl, bold)</H3>
      <H4>H4 — sub-section (base→lg, semibold)</H4>
      <H5>H5 — minor heading (sm→base, semibold)</H5>
      <H6>H6 — smallest heading (sm, semibold)</H6>
      <H1 size="hero">Hero — landing title (4xl→5xl→6xl, bold)</H1>
    </div>
  ),
};

export const SizeOverride: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <H1 size="h2">H1 element, h2 visual size (2xl→3xl, bold)</H1>
      <H2 size="h1">H2 element, h1 visual size (4xl→5xl, bold)</H2>
      <H3 size="h4">H3 element, h4 visual size (base→lg, semibold)</H3>
    </div>
  ),
};

export const Playground: Story = {
  args: { as: "h2", size: "h3", children: "Playground Heading" },
};
