import type { Meta, StoryObj } from "storybook/react";
import { expect, within } from "storybook/test";
import { Plus } from "lucide-react";
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

// --- With actions (interaction-tested) ---

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 2 });
    const button = canvas.getByRole("button", { name: "Add Connection" });

    await expect(heading).toHaveTextContent("Storage Connections");
    await expect(button).toBeInTheDocument();
  },
};

// --- With count badge ---

export const WithCount: Story = {
  args: {
    title: "Search Results",
  },
  render: (args) => (
    <SectionHeader {...args}>
      <Badge color="slate">142 results</Badge>
    </SectionHeader>
  ),
};
