import { Fragment } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ArrowRight, Download, Mail } from "lucide-react";
import { iconRegistry } from "../Icon";
import { Button } from "./Button";

const iconOptions = [undefined, ...Object.keys(iconRegistry)];

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "select" },
    size: { control: "select" },
    iconLeft: { control: "select", options: iconOptions },
    iconRight: { control: "select", options: iconOptions },
  },
  args: {
    children: "Button",
    onPress: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Every variant × size — the canonical visual reference.
const variants = [
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
  "info",
  "neutral",
  "outline",
  "ghost",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--color-muted-foreground)",
  textTransform: "capitalize" as const,
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto repeat(${sizes.length}, max-content)`,
        gap: "12px",
        alignItems: "center",
        justifyItems: "start",
      }}
    >
      <span />
      {sizes.map((size) => (
        <span key={size} style={{ ...labelStyle, textTransform: "uppercase" }}>
          {size}
        </span>
      ))}
      {variants.map((variant) => (
        <Fragment key={variant}>
          <span style={labelStyle}>{variant}</span>
          {sizes.map((size) => (
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              Button
            </Button>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    isLoading: false,
    isDisabled: false,
    children: "Playground",
  },
};

// --- Icons (not covered by the variant grid) ---

export const WithIconLeft: Story = {
  args: { iconLeft: Mail, children: "Send Email" },
};

export const WithIconRight: Story = {
  args: { iconRight: ArrowRight, children: "Next" },
};

export const WithBothIcons: Story = {
  args: { iconLeft: Download, iconRight: ArrowRight, children: "Download" },
};

// --- States ---

export const Loading: Story = {
  args: { isLoading: true, children: "Loading…" },
};

export const Disabled: Story = {
  args: { isDisabled: true, children: "Disabled" },
};

// --- Dark-theme hero pair (not expressible by the variant grid: the light/
// dark token split changes what primary/secondary render as) ---

export const DarkTheme: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="rounded-lg p-8 flex flex-wrap items-center gap-4 bg-canvas-1 border border-hairline"
    >
      <p
        className="basis-full text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-brand-text)" }}
      >
        dark theme — site canvas #160A24 (primary: white on purple-500 = 7.54:1;
        secondary: teal-300 on canvas = 10.51:1, teal-500 border = 7.81:1)
      </p>
      <Button variant="primary" size="lg">
        Try the open-source viewer
      </Button>
      <Button variant="secondary" size="lg">
        Request a demo
      </Button>
    </div>
  ),
};

// --- Interaction test ---

export const ClickInteraction: Story = {
  args: { variant: "primary", children: "Click me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Click me" });

    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

// --- Glowing rotating edge (glow prop) ---

export const GlowEdge: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="rounded-lg p-8 flex flex-wrap items-center gap-6 bg-canvas-1 border border-hairline"
    >
      <p className="basis-full text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--color-brand-text)" }}>
        glow — rotating conic-gradient halo (best on dark surfaces)
      </p>
      <Button glow variant="primary" size="lg">
        Try the open-source viewer
      </Button>
      <Button glow variant="secondary" size="lg">
        Request a demo
      </Button>
      <Button glow variant="primary" size="md">
        Medium
      </Button>
    </div>
  ),
};
