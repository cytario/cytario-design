import type { Meta, StoryObj } from "storybook/react";
import { Pill } from "../../Pill";
import { Select, type SelectItem } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Form/Select",
  component: Select,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    placeholder: { control: "text" },
    errorMessage: { control: "text" },
  },
  args: {
    label: "Staining Method",
    items: [
      { id: "1", name: "H&E Stain" },
      { id: "2", name: "IHC Stain" },
      { id: "3", name: "FISH" },
      { id: "4", name: "Special Stain" },
    ],
    placeholder: "Select an option",
    isDisabled: false,
    isRequired: false,
    className: "",
    errorMessage: "",
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Placeholder: Story = {
  args: { placeholder: "Choose a staining method..." },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Required: Story = {
  args: { isRequired: true },
};

export const WithError: Story = {
  args: { errorMessage: "Please select a staining method." },
};

export const CustomClassName: Story = {
  args: { className: "max-w-xs" },
};

export const Small: Story = {
  args: { size: "sm", label: "Compact Select" },
};

export const Large: Story = {
  args: { size: "lg", label: "Large Select" },
};

export const CustomRender: Story = {
  args: {
    label: "Visibility",
    items: [
      { id: "personal", name: "Personal" },
      { id: "/cytario/engineering", name: "Engineering" },
      { id: "/cytario/pathology", name: "Pathology" },
      { id: "/cytario/research", name: "Research" },
    ],
    renderItem: (item: SelectItem) => <Pill>{item.name}</Pill>,
  },
};

export const CustomRenderSmall: Story = {
  args: {
    ...CustomRender.args,
    size: "sm",
    label: "Compact with Pills",
  },
};
