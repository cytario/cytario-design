import type { Meta, StoryObj } from "storybook/react";
import { TruncatedText } from "./TruncatedText";

const VALUE = "USL-2024-58461-3-very-long-specimen-identifier.ome.tif";

const meta: Meta<typeof TruncatedText> = {
  title: "Components/TruncatedText",
  component: TruncatedText,
  argTypes: {
    ellipsis: {
      control: "inline-radio",
      options: ["left", "middle", "right"],
    },
  },
  args: {
    children: VALUE,
    ellipsis: "right",
  },
  // Constrain width so the text actually overflows and truncates.
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TruncatedText>;

// --- The canonical visual reference: all three modes ---

export const AllModes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TruncatedText {...args} ellipsis="right" />
      <TruncatedText {...args} ellipsis="left" />
      <TruncatedText {...args} ellipsis="middle" />
    </div>
  ),
};

// Click (or Tab + Enter) to copy; tooltip still only shows when truncated.
export const Copy: Story = {
  args: { ellipsis: "middle", copyValue: VALUE },
};

// Fits the container — plain span, no tooltip, no focus stop.
export const NotTruncated: Story = {
  args: { children: "Short" },
};
