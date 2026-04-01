import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Form/Checkbox",
  component: Checkbox,
  argTypes: {
    isDisabled: { control: "boolean" },
    isSelected: { control: "boolean" },
    isIndeterminate: { control: "boolean" },
  },
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// --- Real-world usage stories (from cytario-web) ---

export const DataGridBooleanTrue: Story = {
  name: "Data Grid: Boolean Cell (true)",
  args: { isSelected: true, isDisabled: true, "aria-label": "marker_positive_CD3" },
};

export const DataGridBooleanFalse: Story = {
  name: "Data Grid: Boolean Cell (false)",
  args: { isSelected: false, isDisabled: true, "aria-label": "marker_positive_CD3" },
};

// --- Generic stories ---

export const Default: Story = {
  args: { children: "Accept terms and conditions" },
};

export const Checked: Story = {
  args: { children: "I agree", defaultSelected: true },
};

export const Indeterminate: Story = {
  args: { children: "Select all", isIndeterminate: true },
};

export const Disabled: Story = {
  args: { children: "Disabled option", isDisabled: true },
};

export const DisabledChecked: Story = {
  args: {
    children: "Disabled checked",
    isDisabled: true,
    defaultSelected: true,
  },
};

export const WithoutLabel: Story = {
  args: { "aria-label": "Toggle option" },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultSelected>Checked</Checkbox>
      <Checkbox isIndeterminate>Indeterminate</Checkbox>
      <Checkbox isDisabled>Disabled</Checkbox>
      <Checkbox isDisabled defaultSelected>
        Disabled checked
      </Checkbox>
    </div>
  ),
};

export const ClickInteraction: Story = {
  args: { children: "Toggle me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await userEvent.click(checkbox);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};
