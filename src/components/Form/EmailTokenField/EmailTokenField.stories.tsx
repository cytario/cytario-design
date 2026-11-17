import type { Meta, StoryObj } from "storybook/react";
import { useState } from "react";

import { EmailTokenField } from "./EmailTokenField";

const meta = {
  title: "Components/Form/EmailTokenField",
  component: EmailTokenField,
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    description: { control: "text" },
    errorMessage: { control: "text" },
    maxTokens: { control: "number" },
    isDisabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
} satisfies Meta<typeof EmailTokenField>;

export default meta;
type Story = StoryObj<typeof EmailTokenField>;

export const Playground: Story = {
  args: {
    label: "Emails",
    value: [],
    onChange: () => {},
    placeholder: "name@example.com",
    description: "Separate addresses with a comma, space or semicolon.",
  },
};

export const Controlled: Story = {
  render: () => {
    const [emails, setEmails] = useState<string[]>([
      "ada@example.com",
      "grace@example.com",
    ]);
    return (
      <EmailTokenField
        label="Emails"
        value={emails}
        onChange={setEmails}
        placeholder="name@example.com"
      />
    );
  },
};
