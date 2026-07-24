import type { Meta, StoryObj } from "storybook/react";
import { Prose } from "./Prose";

const meta: Meta<typeof Prose> = {
  title: "Components/Prose",
  component: Prose,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl"],
    },
    invert: {
      control: "boolean",
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof Prose>;

const sample = (
  <>
    <h2>Getting Started</h2>
    <p>
      Welcome to <strong>Cytario Design</strong>. This component wraps long-form
      content with the Tailwind Typography plugin so headings, paragraphs, lists,
      blockquotes, and code blocks receive consistent typographic styling.
    </p>
    <ul>
      <li>Consistent spacing between paragraphs and headings</li>
      <li>Styled lists, blockquotes, and inline code</li>
      <li>Optional <code>invert</code> variant for dark backgrounds</li>
    </ul>
    <blockquote>
      Typography is the craft of endowing human language with enduring visual
      form. — Robert Bringhurst
    </blockquote>
  </>
);

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Prose size="sm">{sample}</Prose>
      <Prose>{sample}</Prose>
      <Prose size="lg">{sample}</Prose>
      <Prose size="xl">{sample}</Prose>
      <div className="rounded-lg bg-slate-900 p-8">
        <Prose invert>{sample}</Prose>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: { size: "default", invert: false },
  render: (args: { size?: "sm" | "default" | "lg" | "xl"; invert?: boolean }) => (
    <Prose {...args}>{sample}</Prose>
  ),
};
