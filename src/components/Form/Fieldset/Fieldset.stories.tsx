import type { Meta, StoryObj } from "storybook/react";
import { Fieldset } from "./Fieldset";
import { Input } from "../Input";
import { RadioGroup, RadioButton } from "../Radio";
import { Select } from "../Select";

const meta: Meta<typeof Fieldset> = {
  title: "Components/Form/Fieldset",
  component: Fieldset,
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

// --- Real-world usage stories (from cytario-web) ---

export const ConnectBucketProvider: Story = {
  name: "Connect Bucket: Provider Step",
  args: {
    children: (
      <RadioGroup
        aria-label="Provider"
        defaultValue="aws"
        className="flex gap-4"
      >
        <RadioButton value="aws">AWS S3</RadioButton>
        <RadioButton value="other">Other</RadioButton>
      </RadioGroup>
    ),
  },
};

export const ConnectBucketAccess: Story = {
  name: "Connect Bucket: Access Step (AWS)",
  args: {
    children: (
      <Input
        label="Role ARN"
        description="The IAM role Cytario will assume to access your S3 data. The role must grant read access to the specified bucket and path."
        placeholder="arn:aws:iam::123456789012:role/MyRole"
        size="lg"
      />
    ),
  },
};

export const ConnectBucketLocation: Story = {
  name: "Connect Bucket: Location Step",
  args: {
    children: (
      <>
        <Input
          label="S3 URI"
          description="Enter the bucket name and optional path prefix where your whole-slide images are stored."
          placeholder="my-bucket/path/prefix"
          prefix="s3://"
          size="lg"
        />
        <Select
          label="Region"
          description="The AWS region where this bucket is located."
          items={[
            { id: "us-east-1", name: "us-east-1" },
            { id: "eu-central-1", name: "eu-central-1" },
            { id: "eu-west-1", name: "eu-west-1" },
          ]}
        />
      </>
    ),
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: {
    legend: "Patient Information",
    children: (
      <>
        <Input label="First name" placeholder="John" isRequired />
        <Input label="Last name" placeholder="Doe" isRequired />
        <Input
          label="Email"
          description="We will use this for communication."
          placeholder="john.doe@example.com"
          type="email"
        />
      </>
    ),
  },
};

export const WithoutLegend: Story = {
  args: {
    children: (
      <>
        <Input label="Field 1" placeholder="Value 1" />
        <Input label="Field 2" placeholder="Value 2" />
      </>
    ),
  },
};
