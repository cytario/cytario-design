import { Fragment } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Cloud } from "lucide-react";
import { iconRegistry } from "../Icon";
import { Badge } from "./Badge";

const iconOptions = [undefined, ...Object.keys(iconRegistry)];

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    variant: { control: "select" },
    size: { control: "select" },
    icon: { control: "select", options: iconOptions },
  },
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Every variant × size — the canonical visual reference.
const variants = [
  "neutral",
  "purple",
  "teal",
  "rose",
  "slate",
  "green",
  "amber",
] as const;

const sizes = ["sm", "md"] as const;

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
            <Badge key={`${variant}-${size}`} variant={variant} size={size}>
              {variant}
            </Badge>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { variant: "neutral", size: "sm", children: "Badge" },
};

// --- Focused examples (not covered by the variant grid) ---

export const WithIcon: Story = {
  args: { variant: "teal", icon: Cloud, children: "AWS" },
};

export const Count: Story = {
  args: { variant: "neutral", children: 1234 },
};
