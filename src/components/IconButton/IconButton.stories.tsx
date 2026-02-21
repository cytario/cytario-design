import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Trash2, Plus, Settings, X, Heart, Download } from "lucide-react";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "destructive",
        "default",
        "success",
        "info",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showTooltip: { control: "boolean" },
    tooltipPlacement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    isLoading: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    icon: Settings,
    "aria-label": "Settings",
    onPress: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// --- Variant stories ---

export const Primary: Story = {
  args: { variant: "primary", icon: Plus, "aria-label": "Add item" },
};

export const Secondary: Story = {
  args: { variant: "secondary", icon: Settings, "aria-label": "Settings" },
};

export const Ghost: Story = {
  args: { variant: "ghost", icon: X, "aria-label": "Close" },
};

export const Destructive: Story = {
  args: { variant: "destructive", icon: Trash2, "aria-label": "Delete" },
};

export const Default: Story = {
  args: { variant: "default", icon: Download, "aria-label": "Download" },
};

export const Success: Story = {
  args: { variant: "success", icon: Heart, "aria-label": "Favorite" },
};

export const Info: Story = {
  args: { variant: "info", icon: Settings, "aria-label": "Info" },
};

// --- Size stories ---

export const Small: Story = {
  args: { size: "sm", icon: X, "aria-label": "Close" },
};

export const Medium: Story = {
  args: { size: "md", icon: Settings, "aria-label": "Settings" },
};

export const Large: Story = {
  args: { size: "lg", icon: Plus, "aria-label": "Add item" },
};

// --- State stories ---

export const Disabled: Story = {
  args: { isDisabled: true, icon: Settings, "aria-label": "Settings" },
};

export const Loading: Story = {
  args: { isLoading: true, icon: Settings, "aria-label": "Loading" },
};

export const WithoutTooltip: Story = {
  args: {
    showTooltip: false,
    icon: X,
    "aria-label": "Close",
  },
};

// --- Playground ---

export const Playground: Story = {
  args: {
    variant: "ghost",
    size: "md",
    icon: Settings,
    "aria-label": "Settings",
    showTooltip: true,
    isLoading: false,
    isDisabled: false,
  },
};

// --- All variants grid ---

const variants = [
  "primary",
  "secondary",
  "ghost",
  "destructive",
  "default",
  "success",
  "info",
] as const;
const sizes = ["sm", "md", "lg"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {variants.map((variant) => (
        <div
          key={variant}
          style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          {sizes.map((size) => (
            <IconButton
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              icon={Settings}
              aria-label={`${variant} ${size}`}
              showTooltip={false}
            />
          ))}
          <span style={{ fontSize: "14px", color: "#666" }}>{variant}</span>
        </div>
      ))}
    </div>
  ),
};

// --- Interaction test ---

export const ClickInteraction: Story = {
  args: { variant: "ghost", icon: X, "aria-label": "Close" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Close" });

    await userEvent.click(button);
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
