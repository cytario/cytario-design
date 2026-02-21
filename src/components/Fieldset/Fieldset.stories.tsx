import type { Meta, StoryObj } from "storybook/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field";
import { Input } from "../Input";

const meta: Meta<typeof Fieldset> = {
  title: "Components/Fieldset",
  component: Fieldset,
};

export default meta;
type Story = StoryObj<typeof Fieldset>;

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
        <Field label="Email" description="We will use this for communication.">
          <Input placeholder="john.doe@example.com" type="email" aria-label="Email" />
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
