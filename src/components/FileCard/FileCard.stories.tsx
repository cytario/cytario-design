import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import {
  File,
  FileSpreadsheet,
  Folder,
  Microscope,
} from "lucide-react";
import { FileCard } from "./FileCard";

const meta: Meta<typeof FileCard> = {
  title: "Components/FileCard",
  component: FileCard,
  argTypes: {
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
    icon: Microscope,
    size: "81.93 GB",
    onPress: fn(),
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const Directory: Story = {
  args: {
    name: "results",
    icon: Folder,
    onPress: fn(),
  },
};

export const CsvFile: Story = {
  name: "CSV file",
  args: {
    name: "analysis.csv",
    icon: FileSpreadsheet,
    size: "1.2 MB",
    onInfo: fn(),
  },
};

export const CompactMode: Story = {
  name: "Compact",
  args: {
    name: "tissue_42.ome.tif",
    icon: Microscope,
    compact: true,
    onPress: fn(),
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const WithOnPress: Story = {
  name: "With onPress",
  args: {
    name: "biopsy_003.ome.tif",
    icon: Microscope,
    size: "45.12 GB",
    onPress: fn(),
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const NoPreview: Story = {
  name: "File without preview",
  args: {
    name: "annotations.parquet",
    icon: FileSpreadsheet,
    size: "4.8 MB",
    onInfo: fn(),
  },
};

export const Grid: Story = {
  name: "Grid layout",
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <FileCard
        name="sample_001.ome.tif"
        icon={Microscope}
        size="81.93 GB"
        onPress={() => {}}
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
      <FileCard
        name="results"
        icon={Folder}
        onPress={() => {}}
      />
      <FileCard
        name="analysis.csv"
        icon={File}
        size="1.2 MB"
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
        icon={Microscope}
        compact
        onPress={() => {}}
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
      <FileCard name="results" icon={Folder} compact onPress={() => {}} />
      <FileCard
        name="analysis.csv"
        icon={FileSpreadsheet}
        compact
        onInfo={() => {}}
      />
      <FileCard
        name="tissue_42.ome.tif"
        icon={Microscope}
        compact
        onPress={() => {}}
        onInfo={() => {}}
      >
        <MockTissuePreview />
      </FileCard>
    </div>
  ),
};
