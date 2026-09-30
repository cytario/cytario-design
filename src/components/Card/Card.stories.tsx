import type { Meta, StoryObj } from "storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    className: { control: "text" },
  },
  args: {
    children: "Card body content goes here.",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
      <Card className="p-4">
        <span className="font-semibold">Default</span>
        <div className="mt-1 text-sm text-muted-foreground">
          Padding via className="p-4"
        </div>
      </Card>

      <Card className="p-6">
        <span className="font-semibold">Large Padding</span>
        <div className="mt-1 text-sm text-muted-foreground">
          className="p-6"
        </div>
      </Card>

      <Card className="p-4" header={<span className="font-semibold p-4 block">With Header</span>}>
        Card body with a header row.
      </Card>

      <Card
        className="p-4"
        header={<span className="font-semibold p-4 block">Header + Footer</span>}
        footer={<div className="flex justify-end gap-2 text-sm text-muted-foreground p-4">Footer content</div>}
      >
        Card body with both header and footer.
      </Card>

      <Card>
        <div className="p-4">No built-in padding — content manages its own</div>
      </Card>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    header: <span className="font-semibold">Card Title</span>,
    footer: (
      <div className="flex justify-end gap-2 text-sm text-muted-foreground">
        Footer content
      </div>
    ),
    className: "p-4",
  },
  render: (args) => <Card {...args} />,
};

// --- Glowing rotating edge (glow prop) ---

export const GlowEdge: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="rounded-lg p-8 flex flex-wrap items-start gap-6 bg-canvas-1 border border-hairline"
    >
      <p className="basis-full text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-brand-text)" }}>
        glow — rotating conic-gradient halo (best on dark surfaces)
      </p>
      <Card glow className="p-4 max-w-sm">
        <span className="font-semibold">Glowing card</span>
        <p className="text-sm text-muted-foreground mt-2">
          A brand-glow halo rotates around the card edge — pure CSS
          (@property-registered angle + conic-gradient ring).
        </p>
      </Card>
      <Card className="p-4 max-w-sm">
        <span className="font-semibold">Plain card</span>
        <p className="text-sm text-muted-foreground mt-2">
          Without the glow prop, for comparison.
        </p>
      </Card>
    </div>
  ),
};
