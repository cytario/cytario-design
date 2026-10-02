import { Fragment } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Dot } from "./Dot";

const meta: Meta<typeof Dot> = {
  title: "Components/Dot",
  component: Dot,
  argTypes: {
    color: { control: "select" },
    size: { control: "select" },
    pulse: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Dot>;

const colors = [
  "accent",
  "primary",
  "neutral",
  "success",
  "warning",
  "destructive",
  "info",
] as const;

const sizes = ["sm", "md", "lg"] as const;

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
      {colors.map((color) => (
        <Fragment key={color}>
          <span style={labelStyle}>{color}</span>
          {sizes.map((size) => (
            <Dot key={`${color}-${size}`} color={color} size={size} />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { color: "accent", size: "md" },
};

export const Pulse: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        padding: "16px",
      }}
    >
      {colors.map((color) => (
        <Dot key={color} color={color} size="lg" pulse />
      ))}
    </div>
  ),
};
