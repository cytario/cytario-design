import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    label: "Label",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// --- Individual stories ---

export const Default: Story = {
  args: { label: "Full name" },
};

export const WithPlaceholder: Story = {
  args: { label: "Email address", placeholder: "you@example.com", type: "email" },
};

export const WithDescription: Story = {
  args: {
    label: "Username",
    placeholder: "pathologist_1",
    description: "This will be visible to other users.",
  },
};

export const Required: Story = {
  args: { label: "Patient ID", isRequired: true, placeholder: "Enter patient ID" },
};

export const Disabled: Story = {
  args: { label: "Case number", value: "CYT-2026-0042", isDisabled: true },
};

export const WithError: Story = {
  args: {
    label: "Email",
    value: "not-an-email",
    errorMessage: "Please enter a valid email address.",
  },
};

export const Password: Story = {
  args: { label: "Password", type: "password", placeholder: "Enter password" },
};

// --- Playground ---

export const Playground: Story = {
  args: {
    label: "Playground",
    placeholder: "Type here...",
    description: "Helper text goes here.",
    type: "text",
    isDisabled: false,
    isRequired: false,
  },
};

// --- All States ---

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "360px" }}>
      <Input label="Default" placeholder="Default state" />
      <Input label="With description" placeholder="Has helper text" description="This is a description." />
      <Input label="Required" isRequired placeholder="Required field" />
      <Input label="Disabled" isDisabled value="Cannot edit" />
      <Input label="Error" value="bad value" errorMessage="Something went wrong." />
      <Input label="Password" type="password" placeholder="Enter password" />
    </div>
  ),
};

// --- Interaction test ---

export const TypingInteraction: Story = {
  args: { label: "Test input", placeholder: "Type here" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.click(input);
    await userEvent.type(input, "Hello pathologist");
    await expect(input).toHaveValue("Hello pathologist");
  },
};
