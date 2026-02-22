import type { Meta, StoryObj } from "storybook/react";
import { ArrowRight, Download, ExternalLink, Plug, Settings } from "lucide-react";
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
        "neutral",
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

// --- Real-world usage stories (from cytario-web) ---

export const ConnectStorage: Story = {
  name: "Connect Storage",
  args: {
    variant: "neutral",
    iconLeft: Plug,
    href: "/connect-bucket",
    children: "Connect Storage",
  },
};

export const ConnectStorageLarge: Story = {
  name: "Connect Storage (Large)",
  args: {
    variant: "neutral",
    size: "lg",
    href: "/connect-bucket",
    children: "Connect Storage",
  },
};

export const AccessWithCyberduck: Story = {
  name: "Access with Cyberduck",
  args: {
    variant: "neutral",
    iconLeft: Download,
    href: "?action=cyberduck",
    children: "Access with Cyberduck",
  },
};

export const DownloadCyberduckProfile: Story = {
  name: "Download Cyberduck Profile",
  args: {
    variant: "primary",
    size: "lg",
    iconLeft: Download,
    href: "/api/cyberduck-profile/aws/my-bucket",
    children: "Download Cyberduck Profile",
  },
};

export const OpenDirectory: Story = {
  name: "Open Directory",
  args: {
    variant: "secondary",
    size: "lg",
    href: "/buckets/aws/my-bucket",
    children: "Open directory",
  },
};

export const OpenFile: Story = {
  name: "Open File",
  args: {
    variant: "secondary",
    size: "lg",
    href: "/buckets/aws/my-bucket/image.ome.tif",
    children: "Open file",
  },
};

export const AddOverlay: Story = {
  name: "Add Overlay",
  args: {
    variant: "default",
    href: "?action=load-overlay",
    children: "Add Overlay",
  },
};

// --- Variant stories ---

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Link",
    iconLeft: Plug,
  },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Link" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Link" },
};

export const WithIconLeft: Story = {
  args: { iconLeft: Download, children: "Download" },
};

export const WithIconRight: Story = {
  args: { iconRight: ArrowRight, children: "Next Page" },
};

export const WithExternalIcon: Story = {
  args: { iconRight: ExternalLink, children: "Open External" },
};

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral Link" },
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
      <ButtonLink href="#" variant="neutral">
        Neutral
      </ButtonLink>
    </div>
  ),
};

// --- IconButtonLink stories ---

export const IconLinkOpenFile: StoryObj<typeof IconButtonLink> = {
  name: "IconButtonLink: Open File",
  render: () => (
    <IconButtonLink
      href="/buckets/aws/my-bucket/overlay.parquet"
      icon={ExternalLink}
      aria-label="Open file"
    />
  ),
};

export const IconLink: StoryObj<typeof IconButtonLink> = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <IconButtonLink href="#" icon={Settings} aria-label="Settings" />
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
