import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Tooltip text",
  },
  // Center stories so the cursor-following tooltip has room to render
  decorators: [
    (Story) => (
      <div
        style={{ padding: "100px", display: "flex", justifyContent: "center" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Rest the cursor on the trigger for 500ms — the tooltip follows the cursor
// position at a fixed offset and flips at viewport edges.
export const CursorFollow: Story = {
  args: {
    content: "Shown after the cursor rests for 500ms",
    children: <Button>Hover me</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content:
      "This is a longer tooltip demonstrating that content wraps naturally without a placement prop — position derives from the cursor.",
    children: <Button>Long tooltip</Button>,
  },
};

// `content={null}` disables the tooltip entirely — useful for conditional
// reveals (e.g. only when text is truncated).
export const Disabled: Story = {
  args: {
    content: null,
    children: <Button>No tooltip</Button>,
  },
};

// Keyboard: tabbing onto the (already focusable) trigger shows the tooltip
// immediately, anchored to the element center. Escape dismisses it.
export const KeyboardFocus: Story = {
  args: {
    content: "Visible on keyboard focus",
    children: <Button>Tab to me</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Tab to me" });

    await userEvent.tab();
    await expect(button).toHaveFocus();

    const tooltip = await within(document.body).findByRole("tooltip");
    await expect(tooltip).toHaveTextContent("Visible on keyboard focus");
  },
};
