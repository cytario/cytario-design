import type { Meta, StoryObj } from "storybook/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field";
import { Input } from "../Input";
import { RadioGroup, RadioButton } from "../Radio";
import { Select } from "../Select";

const meta: Meta<typeof Fieldset> = {
  title: "Components/Fieldset",
  component: Fieldset,
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

// --- Real-world usage stories (from cytario-web) ---

export const ConnectBucketProvider: Story = {
  name: "Connect Bucket: Provider Step",
  args: {
    children: (
      <>
        <Field
          label="Provider"
          description="Choose the type of cloud storage you want to connect. Cytario supports AWS S3 and S3-compatible object storage."
        >
          <RadioGroup
            aria-label="Storage provider"
            defaultValue="aws"
            className="flex gap-4"
          >
            <RadioButton value="aws">AWS S3</RadioButton>
            <RadioButton value="other">Other</RadioButton>
          </RadioGroup>
        </Field>
      </>
    ),
  },
};

export const ConnectBucketAccess: Story = {
  name: "Connect Bucket: Access Step (AWS)",
  args: {
    children: (
      <>
        <Field
          label="Role ARN"
          description="The IAM role Cytario will assume to access your S3 data. The role must grant read access to the specified bucket and path."
        >
          <Input
            placeholder="arn:aws:iam::123456789012:role/MyRole"
            size="lg"
            aria-label="Role ARN"
          />
        </Field>
      </>
    ),
  },
};

export const ConnectBucketLocation: Story = {
  name: "Connect Bucket: Location Step",
  args: {
    children: (
      <>
        <Field
          label="S3 URI"
          description="Enter the bucket name and optional path prefix where your whole-slide images are stored."
        >
          <Input
            placeholder="my-bucket/path/prefix"
            prefix="s3://"
            size="lg"
            aria-label="S3 URI"
          />
        </Field>
        <Field description="The AWS region where this bucket is located.">
          <Select
            label="Region"
            items={[
              { id: "us-east-1", name: "us-east-1" },
              { id: "eu-central-1", name: "eu-central-1" },
              { id: "eu-west-1", name: "eu-west-1" },
            ]}
          />
        </Field>
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
        <Field label="First name" isRequired>
          <Input placeholder="John" aria-label="First name" />
        </Field>
        <Field label="Last name" isRequired>
          <Input placeholder="Doe" aria-label="Last name" />
        </Field>
        <Field
          label="Email"
          description="We will use this for communication."
        >
          <Input
            placeholder="john.doe@example.com"
            type="email"
            aria-label="Email"
          />
        </Field>
      </>
    ),
  },
};

export const WithoutLegend: Story = {
  args: {
    children: (
      <>
        <Field label="Field 1">
          <Input placeholder="Value 1" aria-label="Field 1" />
        </Field>
        <Field label="Field 2">
          <Input placeholder="Value 2" aria-label="Field 2" />
        </Field>
      </>
    ),
  },
};
