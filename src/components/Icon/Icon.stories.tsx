import type { Meta, StoryObj } from "storybook/react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    strokeWidth: {
      control: { type: "number", min: 0.5, max: 4, step: 0.25 },
    },
  },
  args: { icon: "Heart" },
};

export default meta;
type Story = StoryObj<typeof Icon>;

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--color-muted-foreground)",
  textTransform: "uppercase" as const,
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-end" }}>
      {sizes.map((size) => (
        <div
          key={size}
          style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}
        >
          <Icon icon="Search" size={size} />
          <span style={labelStyle}>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  args: { icon: "Heart", size: "md" },
};

export const CustomStrokeWidth: Story = {
  args: { icon: "Settings", strokeWidth: 1 },
};
