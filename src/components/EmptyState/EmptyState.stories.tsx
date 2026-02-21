import type { Meta, StoryObj } from "storybook/react";
import { Inbox, Search, FileX, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: Inbox,
    title: "No items yet",
    description: "Get started by creating your first item.",
    action: <Button variant="primary" iconLeft={Plus}>Create Item</Button>,
  },
};

export const NoResults: Story = {
  args: {
    icon: Search,
    title: "No results found",
    description:
      'Try adjusting your search or filter to find what you are looking for.',
  },
};

export const Error: Story = {
  args: {
    icon: FileX,
    title: "Failed to load data",
    description: "Something went wrong. Please try again later.",
    action: <Button variant="secondary">Retry</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Nothing here",
  },
};

export const WithIconOnly: Story = {
  args: {
    icon: Inbox,
    title: "Your inbox is empty",
  },
};
