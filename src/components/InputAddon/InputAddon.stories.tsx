import type { Meta, StoryObj } from "storybook/react";
import { InputAddon } from "./InputAddon";

const meta: Meta<typeof InputAddon> = {
  title: "Components/InputAddon",
  component: InputAddon,
};

export default meta;
type Story = StoryObj<typeof InputAddon>;

export const Default: Story = {
  args: {
    children: "https://",
  },
};

export const CurrencySymbol: Story = {
  args: {
    children: "$",
  },
};

export const Unit: Story = {
  args: {
    children: ".kg",
  },
};
