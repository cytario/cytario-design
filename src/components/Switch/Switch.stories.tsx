import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    color: {
      control: "text",
    },
    isDisabled: { control: "boolean" },
    isSelected: { control: "boolean" },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// --- Real-world usage stories (from cytario-web) ---

export const ChannelVisibilityRed: Story = {
  name: "Channel Visibility: DAPI (Red)",
  args: {
    "aria-label": "Toggle DAPI visibility",
    color: "rgba(255, 0, 0, 255)",
    defaultSelected: true,
  },
};

export const ChannelVisibilityGreen: Story = {
  name: "Channel Visibility: GFP (Green)",
  args: {
    "aria-label": "Toggle GFP visibility",
    color: "rgba(0, 255, 0, 255)",
    defaultSelected: true,
  },
};

export const ChannelVisibilityDisabled: Story = {
  name: "Channel Visibility: Disabled (max channels)",
  args: {
    "aria-label": "Toggle channel visibility",
    color: "rgba(0, 136, 255, 255)",
    isDisabled: true,
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: { children: "Enable notifications" },
};

export const Selected: Story = {
  args: { children: "Feature enabled", defaultSelected: true },
};

export const Success: Story = {
  args: { children: "Active", color: "success", defaultSelected: true },
};

export const Destructive: Story = {
  args: {
    children: "Danger mode",
    color: "destructive",
    defaultSelected: true,
  },
};

export const Disabled: Story = {
  args: { children: "Disabled", isDisabled: true },
};

export const DisabledSelected: Story = {
  args: {
    children: "Locked on",
    isDisabled: true,
    defaultSelected: true,
  },
};

export const WithoutLabel: Story = {
  args: { "aria-label": "Toggle feature" },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Switch color="primary" defaultSelected>
        Primary (teal)
      </Switch>
      <Switch color="success" defaultSelected>
        Success (green)
      </Switch>
      <Switch color="destructive" defaultSelected>
        Destructive (rose)
      </Switch>
      <Switch>Off state</Switch>
    </div>
  ),
};

export const ArbitraryColor: Story = {
  args: {
    children: "Red channel",
    color: "#FF0000",
    defaultSelected: true,
  },
};

export const ArbitraryColorRgb: Story = {
  args: {
    children: "Green channel",
    color: "rgb(0, 200, 83)",
    defaultSelected: true,
  },
};

export const ChannelColors: Story = {
  name: "Microscopy Channel Colors",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Switch color="#FF0000" defaultSelected>
        DAPI (Red)
      </Switch>
      <Switch color="#00FF00" defaultSelected>
        GFP (Green)
      </Switch>
      <Switch color="#0088FF" defaultSelected>
        Cy5 (Blue)
      </Switch>
      <Switch color="rgb(255, 165, 0)" defaultSelected>
        TRITC (Orange)
      </Switch>
      <Switch color="#FF00FF">Cy3 (Magenta, off)</Switch>
    </div>
  ),
};

export const ToggleInteraction: Story = {
  args: { children: "Toggle me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const switchEl = canvas.getByRole("switch");

    await userEvent.click(switchEl);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};
