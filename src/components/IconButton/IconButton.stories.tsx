import { Fragment } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Settings, X } from "lucide-react";
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
        "destructive",
        "success",
        "warning",
        "info",
        "neutral",
        "outline",
        "ghost",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    showTooltip: { control: "boolean" },
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
            <IconButton
              key={`${variant}-${size}`}
              variant={variant}
              size={size}
              icon={Settings}
              aria-label={`${variant} ${size}`}
              showTooltip={false}
            />
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

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

// --- States ---

export const Loading: Story = {
  args: { isLoading: true, icon: Settings, "aria-label": "Loading" },
};

export const Disabled: Story = {
  args: { isDisabled: true, icon: Settings, "aria-label": "Settings" },
};

export const WithoutTooltip: Story = {
  args: { showTooltip: false, icon: X, "aria-label": "Close" },
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
