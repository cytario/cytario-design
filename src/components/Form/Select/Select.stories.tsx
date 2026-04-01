import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";

const sampleItems = [
  { id: "1", name: "H&E Stain" },
  { id: "2", name: "IHC Stain" },
  { id: "3", name: "FISH" },
  { id: "4", name: "Special Stain" },
];

const awsRegionItems = [
  { id: "us-east-1", name: "us-east-1" },
  { id: "us-east-2", name: "us-east-2" },
  { id: "us-west-1", name: "us-west-1" },
  { id: "us-west-2", name: "us-west-2" },
  { id: "eu-central-1", name: "eu-central-1" },
  { id: "eu-west-1", name: "eu-west-1" },
  { id: "eu-west-2", name: "eu-west-2" },
  { id: "eu-north-1", name: "eu-north-1" },
  { id: "ap-southeast-1", name: "ap-southeast-1" },
  { id: "ap-northeast-1", name: "ap-northeast-1" },
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

// --- Real-world usage stories (from cytario-web) ---

export const AWSRegion: Story = {
  name: "AWS Region Selector",
  args: {
    label: "Region",
    items: awsRegionItems,
    selectedKey: "eu-central-1",
  },
};

export const AWSRegionWithError: Story = {
  name: "AWS Region with Error",
  args: {
    label: "Region",
    items: awsRegionItems,
    errorMessage: "Please select a region.",
  },
};

// --- Generic stories ---

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

export const HiddenLabel: Story = {
  name: "Hidden Label (for use inside Field)",
  args: {
    hideLabel: true,
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
