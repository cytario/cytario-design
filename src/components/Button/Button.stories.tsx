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
