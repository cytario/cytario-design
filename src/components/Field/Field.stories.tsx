import type { Meta, StoryObj } from "storybook/react";
import { Field } from "./Field";
import { Input } from "../Input";
import { Checkbox } from "../Checkbox";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  argTypes: {
    isRequired: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    label: "Full name",
    children: <Input placeholder="Enter your name" aria-label="Full name" />,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Username",
    description: "This will be visible to other users.",
    children: <Input placeholder="pathologist_1" aria-label="Username" />,
  },
};

export const Required: Story = {
  args: {
    label: "Patient ID",
    isRequired: true,
    children: <Input placeholder="Enter patient ID" aria-label="Patient ID" />,
  },
};

export const WithStringError: Story = {
  args: {
    label: "Email",
    error: "Please enter a valid email address.",
    children: <Input placeholder="you@example.com" aria-label="Email" />,
  },
};

export const WithFieldError: Story = {
  args: {
    label: "Email",
    error: { message: "This field is required" },
    children: <Input placeholder="you@example.com" aria-label="Email" />,
  },
};

export const WithCheckbox: Story = {
  args: {
    label: "Preferences",
    description: "Select your notification preferences.",
    children: <Checkbox>Receive email notifications</Checkbox>,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "360px" }}>
      <Field label="Default">
        <Input placeholder="Default state" aria-label="Default" />
      </Field>
      <Field label="With description" description="Helper text goes here.">
        <Input placeholder="Has helper text" aria-label="With description" />
      </Field>
      <Field label="Required" isRequired>
        <Input placeholder="Required field" aria-label="Required" />
      </Field>
      <Field label="With error" error="Something went wrong.">
        <Input placeholder="Error state" aria-label="With error" />
      </Field>
    </div>
  ),
};
