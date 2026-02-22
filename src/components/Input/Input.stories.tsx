import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
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

// --- Real-world usage stories (from cytario-web) ---

export const S3URI: Story = {
  name: "S3 URI with Prefix",
  args: {
    label: "S3 URI",
    placeholder: "my-bucket/path/prefix",
    prefix: "s3://",
    size: "lg",
  },
};

export const RoleARN: Story = {
  name: "Role ARN",
  args: {
    label: "Role ARN",
    placeholder: "arn:aws:iam::123456789012:role/MyRole",
    size: "lg",
  },
};

export const EndpointURL: Story = {
  name: "Endpoint URL",
  args: {
    label: "Endpoint",
    placeholder: "http://localhost:9000",
    size: "lg",
  },
};

export const ProviderName: Story = {
  name: "Provider Name",
  args: {
    label: "Provider Name",
    placeholder: "minio",
    size: "lg",
  },
};

export const ReadOnlyMagnification: Story = {
  name: "Read-only Magnification",
  args: {
    isReadOnly: true,
    value: "20.0",
    className: "w-12 text-sm text-right",
    "aria-label": "Current magnification",
  },
};

export const ReadOnlyExtension: Story = {
  name: "Read-only File Extension",
  args: {
    isReadOnly: true,
    value: "parquet",
    "aria-label": "File extension filter",
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: { label: "Full name" },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Username",
    placeholder: "pathologist_1",
    description: "This will be visible to other users.",
  },
};

export const Required: Story = {
  args: {
    label: "Patient ID",
    isRequired: true,
    placeholder: "Enter patient ID",
  },
};

export const Disabled: Story = {
  args: {
    label: "Case number",
    value: "CYT-2026-0042",
    isDisabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    value: "not-an-email",
    errorMessage: "Please enter a valid email address.",
  },
};

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
};

// --- Without label (raw mode) ---

export const WithoutLabel: Story = {
  args: {
    placeholder: "Raw input without label",
    "aria-label": "Raw input",
  },
};

// --- Sizes ---

export const Small: Story = {
  args: { label: "Small input", size: "sm", placeholder: "Small" },
};

export const Medium: Story = {
  args: {
    label: "Medium input",
    size: "md",
    placeholder: "Medium (default)",
  },
};

export const Large: Story = {
  args: { label: "Large input", size: "lg", placeholder: "Large" },
};

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
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

// --- Prefix ---

export const WithPrefix: Story = {
  args: {
    label: "Price",
    prefix: "$",
    placeholder: "0.00",
    type: "number",
  },
};

export const WithUrlPrefix: Story = {
  args: {
    label: "Website",
    prefix: "https://",
    placeholder: "example.com",
  },
};

// --- Text alignment ---

export const AlignCenter: Story = {
  args: {
    label: "Centered",
    align: "center",
    placeholder: "Centered text",
  },
};

export const AlignRight: Story = {
  args: {
    label: "Right-aligned",
    align: "right",
    placeholder: "Right-aligned text",
  },
};

// --- Playground ---

export const Playground: Story = {
  args: {
    label: "Playground",
    placeholder: "Type here...",
    description: "Helper text goes here.",
    type: "text",
    size: "md",
    align: "left",
    isDisabled: false,
    isRequired: false,
  },
};

// --- All States ---

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "360px",
      }}
    >
      <Input label="Default" placeholder="Default state" />
      <Input
        label="With description"
        placeholder="Has helper text"
        description="This is a description."
      />
      <Input label="Required" isRequired placeholder="Required field" />
      <Input label="Disabled" isDisabled value="Cannot edit" />
      <Input
        label="Error"
        value="bad value"
        errorMessage="Something went wrong."
      />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input placeholder="Without label" aria-label="No label" />
      <Input label="With prefix" prefix="$" placeholder="0.00" />
      <Input label="S3 prefix" prefix="s3://" placeholder="my-bucket/path" />
      <Input label="Right-aligned" align="right" placeholder="Right" />
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
