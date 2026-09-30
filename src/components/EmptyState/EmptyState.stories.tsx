import type { Meta, StoryObj } from "storybook/react";
import { Ban, FileSearch, Inbox, Layers2, Plus, Search } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { ButtonLink } from "../Button";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// --- Real-world usage (from cytario-web) ---

export const StartExploringData: Story = {
  name: "Start Exploring Data",
  args: {
    icon: FileSearch,
    title: "Start exploring your data",
    description: "Add a data connection to view your cloud storage.",
    action: (
      <ButtonLink href="/connect-bucket" size="lg" variant="neutral">
        Connect Storage
      </ButtonLink>
    ),
  },
};

export const NotFound: Story = {
  name: "Not Found / Unsupported",
  args: {
    icon: Ban,
    title: "No objects found in this bucket.",
    description:
      "The page or file you're looking for doesn't exist, has been moved, or isn't supported for viewing.",
    action: <Button>Go Back</Button>,
  },
};

export const NoSearchResults: Story = {
  name: "No Search Results",
  args: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search criteria or filters.",
  },
};

export const AddOverlay: Story = {
  name: "Add Overlay",
  args: {
    icon: Layers2,
    title: "Add Overlay",
    description: "Add parquet cell detection files",
    action: <ButtonLink href="?action=load-overlay">Add Overlay</ButtonLink>,
  },
};

// --- Minimal (title only / icon only) ---

export const TitleOnly: Story = {
  args: {
    title: "No slides loaded",
  },
};

export const WithIconOnly: Story = {
  args: {
    icon: Inbox,
    title: "No annotations in this region",
  },
};
