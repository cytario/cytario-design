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

// --- Variant stories ---

export const Info: Story = {
  args: {
    variant: "info",
    children: "No cost data available for this period.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Month-to-date",
    children:
      "Data through Feb 15, 2026. Figures will change as the month progresses.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Failed to load data for the selected period.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "All data connections are healthy.",
  },
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

// --- Dismissible ---

export const Dismissible: Story = {
  args: {
    variant: "info",
    dismissible: true,
    children: "This banner can be dismissed.",
    onDismiss: fn(),
  },
};

export const DismissibleWarning: Story = {
  args: {
    variant: "warning",
    title: "Month-to-date",
    dismissible: true,
    children: "Data through Feb 15, 2026.",
    onDismiss: fn(),
  },
};

// --- Dapanoskop usage ---

export const MtdBanner: Story = {
  name: "dapanoskop: MTD Warning",
  args: {
    variant: "warning",
    title: "Month-to-date",
    children:
      "Data through Feb 15, 2026. Figures will change as the month progresses and may not be comparable to full-month periods.",
  },
};

export const DataLoadError: Story = {
  name: "dapanoskop: Data Load Error",
  args: {
    variant: "danger",
    children: "Failed to load data for January 2026.",
  },
};

export const NoDataAvailable: Story = {
  name: "dapanoskop: No Data",
  args: {
    variant: "info",
    children: "No cost data available.",
  },
};

// --- All variants ---

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

// --- Interaction test ---

export const DismissInteraction: Story = {
  args: {
    variant: "info",
    dismissible: true,
    children: "Dismiss me!",
    onDismiss: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dismissButton = canvas.getByRole("button", { name: "Dismiss" });

    await userEvent.click(dismissButton);
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};
