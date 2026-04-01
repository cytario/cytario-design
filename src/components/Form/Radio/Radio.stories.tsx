import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { RadioGroup, Radio, RadioButton } from "./Radio";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Form/Radio",
  component: RadioGroup,
  args: {
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// --- Real-world usage stories (from cytario-web) ---

export const StorageProvider: Story = {
  name: "Storage Provider Selection",
  render: (args) => (
    <RadioGroup
      {...args}
      aria-label="Storage provider"
      defaultValue="aws"
      className="flex gap-4"
    >
      <RadioButton value="aws">AWS S3</RadioButton>
      <RadioButton value="other">Other</RadioButton>
    </RadioGroup>
  ),
};

// --- Generic stories ---

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-label="Staining method">
      <Radio value="he">H&E</Radio>
      <Radio value="ihc">IHC</Radio>
      <Radio value="fish">FISH</Radio>
    </RadioGroup>
  ),
};

export const WithDefaultValue: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="ihc" aria-label="Staining method">
      <Radio value="he">H&E</Radio>
      <Radio value="ihc">IHC</Radio>
      <Radio value="fish">FISH</Radio>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} isDisabled aria-label="Staining method">
      <Radio value="he">H&E</Radio>
      <Radio value="ihc">IHC</Radio>
      <Radio value="fish">FISH</Radio>
    </RadioGroup>
  ),
};

export const ButtonStyle: Story = {
  render: (args) => (
    <RadioGroup
      {...args}
      aria-label="View mode"
      orientation="horizontal"
      className="flex flex-row gap-2"
    >
      <RadioButton value="grid">Grid</RadioButton>
      <RadioButton value="list">List</RadioButton>
      <RadioButton value="table">Table</RadioButton>
    </RadioGroup>
  ),
};

export const ButtonStyleWithDefault: Story = {
  render: (args) => (
    <RadioGroup
      {...args}
      defaultValue="list"
      aria-label="View mode"
      orientation="horizontal"
      className="flex flex-row gap-2"
    >
      <RadioButton value="grid">Grid</RadioButton>
      <RadioButton value="list">List</RadioButton>
      <RadioButton value="table">Table</RadioButton>
    </RadioGroup>
  ),
};

export const SelectionInteraction: Story = {
  render: (args) => (
    <RadioGroup {...args} aria-label="Options">
      <Radio value="a">Option A</Radio>
      <Radio value="b">Option B</Radio>
      <Radio value="c">Option C</Radio>
    </RadioGroup>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const radioB = canvas.getByRole("radio", { name: "Option B" });

    await userEvent.click(radioB);
    await expect(args.onChange).toHaveBeenCalled();
  },
};
