import type { Meta, StoryObj } from "storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "subtle"],
    },
  },
  args: {
    children: "Click here",
    href: "#",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { variant: "default", children: "Default link" },
};

export const Subtle: Story = {
  args: { variant: "subtle", children: "Subtle link" },
};

export const InParagraph: Story = {
  render: () => (
    <p className="text-[var(--color-text-primary)]">
      This is a paragraph with a <Link href="#">default link</Link> and a{" "}
      <Link href="#" variant="subtle">
        subtle link
      </Link>{" "}
      inside it.
    </p>
  ),
};

export const Playground: Story = {
  args: {
    variant: "default",
    children: "Playground link",
    href: "#",
  },
};
