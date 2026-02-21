import type { Meta, StoryObj } from "storybook/react";
import { InputGroup } from "./InputGroup";
import { Input } from "../Input";
import { Button } from "../Button";
import { Search } from "lucide-react";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="Search cases..." aria-label="Search" />
      <Button variant="primary" iconLeft={Search}>Search</Button>
    </InputGroup>
  ),
};

export const WithPrefix: Story = {
  render: () => (
    <InputGroup>
      <Button variant="secondary">https://</Button>
      <Input placeholder="example.com" aria-label="URL" />
    </InputGroup>
  ),
};

export const ThreeElements: Story = {
  render: () => (
    <InputGroup>
      <Button variant="secondary">From</Button>
      <Input placeholder="Start date" aria-label="Start date" />
      <Button variant="secondary">To</Button>
    </InputGroup>
  ),
};
