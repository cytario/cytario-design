import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Banner } from "./Banner";

const meta: Meta<typeof Banner> = {
  title: "Components/Banner",
  component: Banner,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "danger", "success"],
    },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

// --- The canonical visual reference ---

const variants = ["info", "warning", "danger", "success"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {variants.map((variant) => (
        <Banner key={variant} variant={variant}>
          This is a {variant} banner message.
        </Banner>
      ))}
    </div>
  ),
};

// --- With title ---

export const WithTitle: Story = {
  args: {
    variant: "warning",
    title: "Month-to-date",
    children:
      "Data through Feb 15, 2026. Figures will change as the month progresses.",
  },
};

// --- Dismissible (also the dismiss interaction test) ---

export const Dismissible: Story = {
  args: {
    variant: "info",
    dismissible: true,
    children: "This banner can be dismissed.",
    onDismiss: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dismissButton = canvas.getByRole("button", { name: "Dismiss" });

    await userEvent.click(dismissButton);
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};
