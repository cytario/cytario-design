import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "success", "destructive"],
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
  args: { children: "Danger mode", color: "destructive", defaultSelected: true },
};

export const Disabled: Story = {
  args: { children: "Disabled", isDisabled: true },
};

export const DisabledSelected: Story = {
  args: { children: "Locked on", isDisabled: true, defaultSelected: true },
};

export const WithoutLabel: Story = {
  args: { "aria-label": "Toggle feature" },
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Switch color="primary" defaultSelected>Primary (teal)</Switch>
      <Switch color="success" defaultSelected>Success (green)</Switch>
      <Switch color="destructive" defaultSelected>Destructive (rose)</Switch>
      <Switch>Off state</Switch>
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
