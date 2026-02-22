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

// --- Real-world usage stories (from cytario-web) ---

export const ExternalDownload: Story = {
  name: "External Link: Cyberduck Download",
  args: {
    variant: "default",
    children: "Cyberduck",
    href: "https://cyberduck.io/download/",
    target: "_blank",
    rel: "noopener noreferrer",
  },
};

// --- Generic stories ---

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

export const InInstructionList: Story = {
  name: "In Instruction List",
  render: () => (
    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
      <li>
        Download and install{" "}
        <Link
          href="https://cyberduck.io/download/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cyberduck
        </Link>{" "}
        (version 8.7.0 or later)
      </li>
      <li>Download the connection profile below</li>
      <li>Double-click the downloaded profile to add it to Cyberduck</li>
      <li>Connect and authenticate when prompted</li>
    </ol>
  ),
};

export const Playground: Story = {
  args: {
    variant: "default",
    children: "Playground link",
    href: "#",
  },
};
