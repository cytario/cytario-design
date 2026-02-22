import type { Meta, StoryObj } from "storybook/react";
import { Field } from "./Field";
import { Input } from "../Input";
import { Checkbox } from "../Checkbox";
import { Select } from "../Select";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  argTypes: {
    isRequired: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

// --- Real-world usage stories (from cytario-web) ---

export const StorageProvider: Story = {
  name: "Connect Bucket: Provider",
  args: {
    label: "Provider",
    description:
      "Choose the type of cloud storage you want to connect. Cytario supports AWS S3 and S3-compatible object storage.",
    children: <Input placeholder="aws" aria-label="Provider" />,
  },
};

export const ProviderName: Story = {
  name: "Connect Bucket: Provider Name",
  args: {
    label: "Provider Name",
    description:
      "A user-friendly name to identify this storage connection.",
    children: (
      <Input placeholder="minio" size="lg" aria-label="Provider Name" />
    ),
  },
};

export const RoleARN: Story = {
  name: "Connect Bucket: Role ARN",
  args: {
    label: "Role ARN",
    description:
      "The IAM role Cytario will assume to access your S3 data. The role must grant read access to the specified bucket and path. Cytario uses temporary credentials and does not store long-term secrets.",
    children: (
      <Input
        placeholder="arn:aws:iam::123456789012:role/MyRole"
        size="lg"
        aria-label="Role ARN"
      />
    ),
  },
};

export const Endpoint: Story = {
  name: "Connect Bucket: Endpoint",
  args: {
    label: "Endpoint",
    description:
      "The endpoint URL of your S3-compatible storage. This is the base URL cytario will use to connect to your storage service.",
    children: (
      <Input
        placeholder="http://localhost:9000"
        size="lg"
        aria-label="Endpoint"
      />
    ),
  },
};

export const S3URI: Story = {
  name: "Connect Bucket: S3 URI",
  args: {
    label: "S3 URI",
    description:
      "Enter the bucket name and optional path prefix where your whole-slide images are stored (e.g. my-bucket/data/images).",
    children: (
      <Input
        placeholder="my-bucket/path/prefix"
        prefix="s3://"
        size="lg"
        aria-label="S3 URI"
      />
    ),
  },
};

export const BucketRegion: Story = {
  name: "Connect Bucket: Region",
  args: {
    description: "The AWS region where this bucket is located.",
    children: (
      <Select
        label="Region"
        items={[
          { id: "us-east-1", name: "us-east-1" },
          { id: "eu-central-1", name: "eu-central-1" },
          { id: "eu-west-1", name: "eu-west-1" },
        ]}
      />
    ),
  },
};

// --- Generic stories ---

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        maxWidth: "360px",
      }}
    >
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
