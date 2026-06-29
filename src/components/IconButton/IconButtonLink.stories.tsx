import type { Meta, StoryObj } from "storybook/react";
import { IconButtonLink } from "./IconButton";

// Visual styling is identical to IconButton (shared base) — see its AllVariants
// grid for the full variant × size matrix. These stories just cover the
// link-specific behaviour (renders an <a>).
const meta: Meta<typeof IconButtonLink> = {
  title: "Components/IconButtonLink",
  component: IconButtonLink,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
        "neutral",
        "outline",
        "ghost",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    icon: "ExternalLink",
    label: "Open external",
    href: "#",
  },
};

export default meta;
type Story = StoryObj<typeof IconButtonLink>;

export const Playground: Story = {
  args: {
    variant: "ghost",
    size: "md",
    icon: "Settings",
    label: "Settings",
    href: "#",
  },
};

export const OpenExternal: Story = {
  args: {
    icon: "ExternalLink",
    label: "Open external",
    variant: "primary",
  },
};
