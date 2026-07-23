import type { Meta, StoryObj } from "storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  argTypes: {
    scale: { control: "number", min: 0.1, step: 0.1 },
    color: { control: "text" },
    highlightColor: { control: "text" },
  },
  args: {
    scale: 1,
  },
  render: (args) => <Logo {...args} />,
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Default (theme-driven) on light background */}
      <div className="bg-background border border-border rounded-lg p-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          default (theme-driven) — light background
        </p>
        <Logo />
      </div>

      {/* Default (theme-driven) on dark background — uses dark theme override */}
      <div data-theme="dark" className="rounded-lg p-8" style={{ background: "#0f172a" }}>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          default (theme-driven) — dark background
        </p>
        <Logo />
      </div>

      {/* Default on brand purple */}
      <div className="rounded-lg p-8" style={{ background: "#5c2483" }}>
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
          default — brand purple background (use color escape hatch)
        </p>
        <Logo color="#ffffff" />
      </div>

      {/* Monochrome white (escape hatch) */}
      <div data-theme="dark" className="rounded-lg p-8" style={{ background: "#0f172a" }}>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          monochrome white (escape hatch)
        </p>
        <Logo color="#ffffff" highlightColor="#ffffff" />
      </div>

      {/* Monochrome black (escape hatch) */}
      <div className="bg-background border border-border rounded-lg p-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          monochrome black (escape hatch)
        </p>
        <Logo color="#000000" highlightColor="#000000" />
      </div>

      {/* Custom colors (escape hatch) */}
      <div className="bg-background border border-border rounded-lg p-8">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          custom colors (escape hatch)
        </p>
        <Logo color="#dc2626" highlightColor="#2563eb" />
      </div>
    </div>
  ),
};

export const Scaled: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4 p-8">
      <Logo scale={0.8} />
      <Logo scale={1} />
      <Logo scale={1.4} />
      <Logo scale={2} />
      <Logo scale={3} />
    </div>
  ),
};
