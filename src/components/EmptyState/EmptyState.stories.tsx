import type { Meta, StoryObj } from "storybook/react";
import { Ban, FileSearch, Inbox, Layers2, Plus, Search, SearchX } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button";
import { ButtonLink } from "../ButtonLink";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// --- Real-world usage stories (from cytario-web) ---

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

export const PageNotFound: Story = {
  name: "Page Not Found",
  args: {
    icon: Ban,
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    action: <Button>Go Back</Button>,
  },
};

export const UnsupportedFileFormat: Story = {
  name: "Unsupported File Format",
  args: {
    icon: Ban,
    title: "Unsupported file format.",
    description: "The selected file format is not supported for viewing.",
    action: <Button>Go Back</Button>,
  },
};

export const NoObjectsFound: Story = {
  name: "No Objects Found",
  args: {
    icon: Ban,
    title: "No objects found in this bucket.",
    description: "Try uploading some files or check your permissions.",
    action: <Button>Go Back</Button>,
  },
};

export const NoSearchResults: Story = {
  name: "No Search Results",
  args: {
    icon: SearchX,
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

// --- Generic stories ---

export const Default: Story = {
  args: {
    icon: Inbox,
    title: "No datasets available",
    description: "Connect a storage source to begin browsing datasets.",
    action: (
      <Button variant="primary" iconLeft={Plus}>
        Add Data Source
      </Button>
    ),
  },
};

export const NoResults: Story = {
  args: {
    icon: Search,
    title: "No matching specimens",
    description:
      "Try adjusting your search terms or filters to locate specimens.",
  },
};

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
