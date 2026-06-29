import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { InputPassword } from "./InputPassword";

const meta: Meta<typeof InputPassword> = {
  title: "Components/Form/InputPassword",
  component: InputPassword,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    isRequired: { control: "boolean" },
    isDisabled: { control: "boolean" },
    isToggleDisabled: { control: "boolean" },
  },
  args: {
    label: "Password",
    placeholder: "Enter password",
    defaultValue: "hunter2",
  },
};

export default meta;
type Story = StoryObj<typeof InputPassword>;

export const Default: Story = {};

export const WithError: Story = {
  args: { errorMessage: "Password must be at least 12 characters." },
};

export const WithDescription: Story = {
  args: { description: "Use at least 12 characters, mixing letters and symbols." },
};

export const Required: Story = {
  args: { isRequired: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

// Input stays interactive; only the reveal toggle is disabled.
export const ToggleDisabled: Story = {
  args: { isToggleDisabled: true },
};

export const Playground: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    size: "md",
    isRequired: false,
    isDisabled: false,
    isToggleDisabled: false,
  },
};

// --- Interaction test: toggle reveals then re-hides the value ---

export const ToggleInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password") as HTMLInputElement;
    const toggle = canvas.getByRole("button", { name: "Show password" });

    await expect(input.type).toBe("password");
    await userEvent.click(toggle);
    await expect(input.type).toBe("text");

    await userEvent.click(
      canvas.getByRole("button", { name: "Hide password" }),
    );
    await expect(input.type).toBe("password");
  },
};
