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
    color: { control: "select" },
    size: { control: "select" },
    icon: { control: "select", options: iconOptions },
  },
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

const colors = [
  "neutral",
  "purple",
  "teal",
  "rose",
  "slate",
  "green",
  "amber",
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
      {colors.map((color) => (
        <Fragment key={color}>
          <span style={labelStyle}>{color}</span>
          {sizes.map((size) => (
            <Badge key={`${color}-${size}`} color={color} size={size}>
              {color}
            </Badge>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: { color: "slate", size: "sm", children: "Badge" },
};

export const WithIcon: Story = {
  args: { color: "teal", icon: Cloud, children: "AWS" },
};

export const Count: Story = {
  args: { color: "neutral", children: 1234 },
};
