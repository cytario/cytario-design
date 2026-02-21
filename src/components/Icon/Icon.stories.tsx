import type { Meta, StoryObj } from "storybook/react";
import { Heart, Search, Settings, AlertTriangle } from "lucide-react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    strokeWidth: {
      control: { type: "number", min: 0.5, max: 4, step: 0.25 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: { icon: Heart },
};

export const Small: Story = {
  args: { icon: Heart, size: "sm" },
};

export const Large: Story = {
  args: { icon: Heart, size: "lg" },
};

export const ExtraLarge: Story = {
  args: { icon: Heart, size: "xl" },
};

export const WithLabel: Story = {
  args: { icon: AlertTriangle, "aria-label": "Warning" },
};

export const CustomStrokeWidth: Story = {
  args: { icon: Settings, strokeWidth: 1 },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Icon icon={Search} size="sm" />
      <Icon icon={Search} size="md" />
      <Icon icon={Search} size="lg" />
      <Icon icon={Search} size="xl" />
    </div>
  ),
};
