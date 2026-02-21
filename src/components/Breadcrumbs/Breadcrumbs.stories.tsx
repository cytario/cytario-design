import type { Meta, StoryObj } from "storybook/react";
import { Breadcrumbs } from "./Breadcrumbs";

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

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

export const Playground: Story = {
  args: {
    items: [
      { id: "home", label: "Home", href: "#" },
      { id: "section", label: "Section", href: "#" },
      { id: "page", label: "Page" },
    ],
  },
};
