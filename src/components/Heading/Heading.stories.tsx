import type { Meta, StoryObj } from "storybook/react";
import { Heading, H1, H2, H3 } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
    },
    weight: {
      control: "select",
      options: ["semibold", "bold"],
    },
  },
  args: {
    children: "Heading",
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

// --- Real-world usage stories (from cytario-web) ---

export const PageTitle: Story = {
  name: "Page Title: Storage Connections",
  render: () => <H1>Your Storage Connections</H1>,
};

export const SearchResults: Story = {
  name: "Search Results Heading",
  render: () => <H1>Search: ome.tif</H1>,
};

export const DirectoryTitle: Story = {
  name: "Directory View Title",
  render: () => (
    <H1 className="flex-grow text-2xl sm:text-3xl md:text-4xl">
      my-bucket
    </H1>
  ),
};

export const SectionHeading: Story = {
  name: "Section: Recently Viewed",
  render: () => <H2>Recently Viewed</H2>,
};

export const SearchResultsSection: Story = {
  name: "Section: All Results",
  render: () => <H2>All Results</H2>,
};

export const SubHeading: Story = {
  name: "Sub-heading: Quick Start",
  render: () => <H3 className="text-lg font-normal">Quick Start</H3>,
};

// --- Generic stories ---

export const Default: Story = {
  args: { children: "Default Heading (h2)" },
};

export const AsH1: Story = {
  args: { as: "h1", children: "Heading Level 1" },
};

export const AsH3: Story = {
  args: { as: "h3", children: "Heading Level 3" },
};

export const CustomSize: Story = {
  args: { as: "h3", size: "2xl", children: "H3 at 2xl size" },
};

export const Size3xl: Story = {
  args: { as: "h1", size: "3xl", children: "Heading at 3xl size" },
};

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Heading as="h1">Heading 1 (2xl)</Heading>
      <Heading as="h2">Heading 2 (xl)</Heading>
      <Heading as="h3">Heading 3 (lg)</Heading>
      <Heading as="h4">Heading 4 (md)</Heading>
      <Heading as="h5">Heading 5 (sm)</Heading>
      <Heading as="h6">Heading 6 (xs)</Heading>
    </div>
  ),
};

export const ConvenienceComponents: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <H1>H1 Convenience Component</H1>
      <H2>H2 Convenience Component</H2>
      <H3>H3 Convenience Component</H3>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    as: "h2",
    size: "xl",
    weight: "semibold",
    children: "Playground Heading",
  },
};
