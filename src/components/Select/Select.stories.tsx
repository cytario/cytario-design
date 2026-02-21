import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";

const sampleItems = [
  { id: "1", name: "H&E Stain" },
  { id: "2", name: "IHC Stain" },
  { id: "3", name: "FISH" },
  { id: "4", name: "Special Stain" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  argTypes: {
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    errorMessage: { control: "text" },
    placeholder: { control: "text" },
  },
  args: {
    label: "Staining Method",
    items: sampleItems,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// --- Stories ---

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Choose a staining method...",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "Please select a staining method.",
  },
};

export const Required: Story = {
  args: {
    isRequired: true,
  },
};

// --- Playground ---

export const Playground: Story = {
  args: {
    label: "Staining Method",
    items: sampleItems,
    placeholder: "Select an option",
    isDisabled: false,
    isRequired: false,
    errorMessage: "",
  },
};

// --- Interaction test ---

export const SelectItem: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await userEvent.click(trigger);

    const option = canvas.getByRole("option", { name: "FISH" });
    await userEvent.click(option);

    await expect(trigger).toHaveTextContent("FISH");
  },
};
