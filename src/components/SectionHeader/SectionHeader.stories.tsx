import type { Meta, StoryObj } from "storybook/react";
import { expect, within } from "storybook/test";
import { Plus, Download, UserPlus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Button } from "../Button";
import { Badge } from "../Badge";

const meta: Meta<typeof SectionHeader> = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  args: {
    title: "Section Title",
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeader>;

// --- Basic stories ---

export const Default: Story = {
  args: {
    title: "Recently Viewed",
  },
};

export const WithActions: Story = {
  args: {
    title: "Storage Connections",
  },
  render: (args) => (
    <SectionHeader {...args}>
      <Button variant="primary" size="sm" iconLeft={Plus}>
        Add Connection
      </Button>
    </SectionHeader>
  ),
};

export const WithCount: Story = {
  args: {
    title: "Search Results",
  },
  render: (args) => (
    <SectionHeader {...args}>
      <Badge variant="slate">142 results</Badge>
    </SectionHeader>
  ),
};

// --- Real-world usage from cytario-web admin/users screen ---

export const AdminUsers: Story = {
  name: "Admin: Users",
  args: {
    title: "Users",
  },
  render: (args) => (
    <SectionHeader {...args}>
      <Button variant="secondary" size="sm" iconLeft={Download}>
        Export CSV
      </Button>
      <Button variant="primary" size="sm" iconLeft={UserPlus}>
        Invite User
      </Button>
    </SectionHeader>
  ),
};

// --- Interaction test ---

export const RendersHeading: Story = {
  args: {
    title: "My Section",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2 });

    await expect(heading).toHaveTextContent("My Section");
  },
};

export const RendersActions: Story = {
  args: {
    title: "With Actions",
  },
  render: (args) => (
    <SectionHeader {...args}>
      <Button variant="primary" size="sm">
        Action
      </Button>
    </SectionHeader>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2 });
    const button = canvas.getByRole("button", { name: "Action" });

    await expect(heading).toHaveTextContent("With Actions");
    await expect(button).toBeInTheDocument();
  },
};
