import type { Meta, StoryObj } from "storybook/react";
import { ArrowRight, ExternalLink, Mail, Settings } from "lucide-react";
import { ButtonLink, IconButtonLink } from "./ButtonLink";

const meta: Meta<typeof ButtonLink> = {
  title: "Components/ButtonLink",
  component: ButtonLink,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "destructive",
        "default",
        "success",
        "info",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    children: "Link",
    href: "#",
  },
};

export default meta;
type Story = StoryObj<typeof ButtonLink>;

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Link" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Link" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Link" },
};

export const WithIconLeft: Story = {
  args: { iconLeft: Mail, children: "Email Us" },
};

export const WithIconRight: Story = {
  args: { iconRight: ArrowRight, children: "Next Page" },
};

export const WithExternalIcon: Story = {
  args: { iconRight: ExternalLink, children: "Open External" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <ButtonLink href="#" variant="primary">
        Primary
      </ButtonLink>
      <ButtonLink href="#" variant="secondary">
        Secondary
      </ButtonLink>
      <ButtonLink href="#" variant="ghost">
        Ghost
      </ButtonLink>
      <ButtonLink href="#" variant="destructive">
        Destructive
      </ButtonLink>
    </div>
  ),
};

// --- IconButtonLink stories ---

export const IconLink: StoryObj<typeof IconButtonLink> = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <IconButtonLink
        href="#"
        icon={Settings}
        aria-label="Settings"
      />
      <IconButtonLink
        href="#"
        icon={ExternalLink}
        aria-label="Open external"
        variant="primary"
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Playground",
    href: "#",
  },
};
