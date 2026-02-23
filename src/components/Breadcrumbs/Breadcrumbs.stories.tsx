import type { Meta, StoryObj } from "storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

// --- Real-world usage stories (from cytario-web) ---

export const BucketNavigation: Story = {
  name: "Bucket Navigation",
  args: {
    items: [
      {
        id: "bucket",
        label: "my-pathology-data",
        href: "/buckets/aws/my-pathology-data",
      },
      {
        id: "folder",
        label: "slides",
        href: "/buckets/aws/my-pathology-data/slides",
      },
      { id: "current", label: "batch-001" },
    ],
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "products", label: "Products", href: "#" },
      { id: "current", label: "Current Page" },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "current", label: "Current Page" },
    ],
  },
};

export const ManyLevels: Story = {
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "category", label: "Category", href: "#" },
      { id: "subcategory", label: "Subcategory", href: "#" },
      { id: "product", label: "Product", href: "#" },
      { id: "current", label: "Details" },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ id: "home", label: "Home" }],
  },
};

export const LongFilenameTruncation: Story = {
  name: "Long Filename (Truncated)",
  args: {
    items: [
      { id: "org", label: "cytario Research", href: "#" },
      { id: "project", label: "LUNG-TMA-2024", href: "#" },
      {
        id: "file",
        label: "LUNG_TMA_P2_S04_AF_M1_C301_very_long_filename_example.qptiff",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export const Playground: Story = {
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "section", label: "Section", href: "#" },
      { id: "page", label: "Page" },
    ],
  },
};
