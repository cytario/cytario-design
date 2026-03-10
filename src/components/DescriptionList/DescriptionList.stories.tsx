import type { Meta, StoryObj } from "storybook/react";
import { DescriptionList } from "./DescriptionList";

const meta: Meta<typeof DescriptionList> = {
  title: "Components/DescriptionList",
  component: DescriptionList,
  argTypes: {
    layout: {
      control: "select",
      options: ["stacked", "horizontal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Stacked: Story = {
  args: {
    layout: "stacked",
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Item label="Provider">AWS</DescriptionList.Item>
      <DescriptionList.Item label="Region">eu-central-1</DescriptionList.Item>
      <DescriptionList.Item label="S3 URI">
        <span>
          <span className="text-[var(--color-text-secondary)]">s3://</span>
          cytario-research-data/slides/
        </span>
      </DescriptionList.Item>
      <DescriptionList.Item label="Created by" muted>
        m.schneider@vericura.com
      </DescriptionList.Item>
    </DescriptionList>
  ),
};

export const Horizontal: Story = {
  args: {
    layout: "horizontal",
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Item label="Size">2.4 GB</DescriptionList.Item>
      <DescriptionList.Item label="Last Modified">
        2026-02-18 14:32 UTC
      </DescriptionList.Item>
      <DescriptionList.Item label="Content Type">
        image/tiff
      </DescriptionList.Item>
      <DescriptionList.Item label="Storage Class">
        STANDARD
      </DescriptionList.Item>
      <DescriptionList.Item
        label="ETag"
        muted
        fullValue="a3f8c91b2d4e6f7a8b9c0d1e2f3a4b5c"
      >
        a3f8c91b2d4e...
      </DescriptionList.Item>
    </DescriptionList>
  ),
};

export const WithTooltip: Story = {
  name: "Truncated Value with Tooltip",
  args: {
    layout: "horizontal",
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Item label="File">
        case-2024-0193_HE.ome.tif
      </DescriptionList.Item>
      <DescriptionList.Item
        label="ETag"
        muted
        fullValue="a3f8c91b2d4e6f7a8b9c0d1e2f3a4b5c"
      >
        a3f8c91b2d4e...
      </DescriptionList.Item>
      <DescriptionList.Item
        label="Version ID"
        muted
        fullValue="v8Kj2mNpQ3xYz1aBcDeFgHiJkLmNoP"
      >
        v8Kj2mNpQ3xY...
      </DescriptionList.Item>
    </DescriptionList>
  ),
};

export const MutedValues: Story = {
  name: "Muted Values",
  args: {
    layout: "stacked",
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Item label="Alias">
        vericura internal
      </DescriptionList.Item>
      <DescriptionList.Item label="Created by" muted>
        m.schneider@vericura.com
      </DescriptionList.Item>
      <DescriptionList.Item label="Connection ID" muted>
        conn-a8f3e21b
      </DescriptionList.Item>
    </DescriptionList>
  ),
};
