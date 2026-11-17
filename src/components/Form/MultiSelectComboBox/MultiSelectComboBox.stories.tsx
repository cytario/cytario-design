import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import type { Key } from "react-aria-components";

import { MultiSelectComboBox } from "./MultiSelectComboBox";

const GROUPS = [
  { id: "customers/vericura", name: "customers/vericura" },
  { id: "customers/acme", name: "customers/acme" },
  { id: "lab/team-a", name: "lab/team-a" },
  { id: "lab/team-b", name: "lab/team-b" },
];

const meta: Meta<typeof MultiSelectComboBox> = {
  title: "Components/Form/MultiSelectComboBox",
  component: MultiSelectComboBox,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  args: {
    label: "Groups",
    items: GROUPS,
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelectComboBox>;

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "360px",
      }}
    >
      {(["sm", "md", "lg"] as const).map((size) => (
        <MultiSelectComboBox
          key={size}
          label={size}
          size={size}
          items={GROUPS}
          defaultValue={["customers/vericura"]}
        />
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    size: "md",
    placeholder: "Select…",
    description: "",
    errorMessage: "",
    isDisabled: false,
    isRequired: false,
  },
};

export const WithDescription: Story = {
  args: {
    description: "The invitee joins these groups on first login.",
  },
};

export const WithError: Story = {
  args: {
    isRequired: true,
    errorMessage: "Select at least one group.",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultValue: ["customers/acme"],
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<Key[]>(["customers/vericura"]);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <MultiSelectComboBox {...args} value={value} onChange={setValue} />
        <span style={{ color: "var(--color-muted-foreground)" }}>
          Value: {JSON.stringify(value)}
        </span>
      </div>
    );
  },
};

export const SelectInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.type(canvas.getByRole("combobox"), "acm");
    const option = await body.findByRole("option", { name: "customers/acme" });
    await userEvent.click(option);
    await userEvent.keyboard("{Escape}");

    const tag = await canvas.findByRole("row", { name: "customers/acme" });
    await userEvent.click(within(tag).getByRole("button"));
    await expect(
      canvas.queryByRole("row", { name: "customers/acme" }),
    ).not.toBeInTheDocument();
  },
};
