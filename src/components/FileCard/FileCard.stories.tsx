import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { FileCard } from "./FileCard";

const meta: Meta<typeof FileCard> = {
  title: "Components/FileCard",
  component: FileCard,
  argTypes: {
    type: { control: "select", options: ["file", "directory"] },
    compact: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof FileCard>;

/* ------------------------------------------------------------------ */
/*  Mock fluorescence tissue preview                                   */
/* ------------------------------------------------------------------ */

function MockTissuePreview() {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: "#000000",
        backgroundImage: [
          "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
          "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
          "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
          "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
        ].join(", "),
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Stories                                                             */
/* ------------------------------------------------------------------ */

export const ImageFile: Story = {
  name: "OME-TIFF with preview",
  args: {
    name: "sample_001.ome.tif",
    type: "file",
    size: "81.93 GB",
    extension: "ome.tif",
    hasPreview: true,
    href: "#",
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const Directory: Story = {
  args: {
    name: "results",
    type: "directory",
    href: "#",
  },
};

export const CsvFile: Story = {
  name: "CSV file",
  args: {
    name: "analysis.csv",
    type: "file",
    size: "1.2 MB",
    extension: "csv",
    onInfo: fn(),
  },
};

export const CompactMode: Story = {
  name: "Compact",
  args: {
    name: "tissue_42.ome.tif",
    type: "file",
    extension: "ome.tif",
    compact: true,
    hasPreview: true,
    href: "#",
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const WithOnPress: Story = {
  name: "With onPress",
  args: {
    name: "biopsy_003.ome.tif",
    type: "file",
    size: "45.12 GB",
    extension: "ome.tif",
    onPress: fn(),
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const NoPreview: Story = {
  name: "File without preview",
  args: {
    name: "annotations.parquet",
    type: "file",
    size: "4.8 MB",
    extension: "parquet",
    onInfo: fn(),
  },
};

export const Grid: Story = {
  name: "Grid layout",
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <FileCard
        name="sample_001.ome.tif"
        type="file"
        size="81.93 GB"
        extension="ome.tif"
        href="#"
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
      <FileCard
        name="results"
        type="directory"
        href="#"
      />
      <FileCard
        name="analysis.csv"
        type="file"
        size="1.2 MB"
        extension="csv"
        onInfo={() => {}}
      />
    </div>
  ),
};

export const CompactGrid: Story = {
  name: "Compact grid layout",
  render: () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      <FileCard
        name="sample_001.ome.tif"
        type="file"
        extension="ome.tif"
        compact
        href="#"
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
      <FileCard name="results" type="directory" compact href="#" />
      <FileCard
        name="analysis.csv"
        type="file"
        extension="csv"
        compact
        onInfo={() => {}}
      />
      <FileCard
        name="tissue_42.ome.tif"
        type="file"
        extension="ome.tif"
        compact
        href="#"
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
    </div>
  ),
};
