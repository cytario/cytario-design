import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ArrowRight, Download, Mail, Trash2 } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
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
        "neutral",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    isLoading: { control: "boolean" },
    isDisabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    onPress: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// --- Real-world usage stories (from cytario-web) ---

export const Primary: Story = {
  args: { variant: "primary", size: "lg", children: "Submit" },
};

export const Secondary: Story = {
  args: { variant: "secondary", size: "lg", children: "Back" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive", size: "lg", children: "Remove Data Connection" },
};

export const DestructiveClearStorage: Story = {
  name: "Destructive: Clear Local Storage",
  args: { variant: "destructive", children: "Clear Local Storage" },
};

export const Default: Story = {
  args: { variant: "default", children: "Default" },
};

export const Success: Story = {
  args: { variant: "success", children: "Success" },
};

export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral" },
};

// --- Real-world patterns ---

export const FormWizardNext: Story = {
  name: "Form Wizard: Next",
  args: { variant: "primary", size: "lg", children: "Next", type: "button" },
};

export const FormWizardSubmit: Story = {
  name: "Form Wizard: Submit",
  args: { variant: "primary", size: "lg", children: "Connecting...", isDisabled: true },
};

export const GoBack: Story = {
  name: "Go Back",
  args: { variant: "default", children: "Go Back" },
};

export const ConvertToParquet: Story = {
  name: "Convert to Parquet",
  args: { variant: "default", children: "Convert to Parquet" },
};

export const DisabledDownload: Story = {
  name: "Disabled Download",
  args: { size: "lg", isDisabled: true, children: "Download file" },
};

// --- Size stories ---

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

// --- Icon stories ---

export const WithIconLeft: Story = {
  args: { iconLeft: Mail, children: "Send Email" },
};

export const WithIconRight: Story = {
  args: { iconRight: ArrowRight, children: "Next" },
};

export const WithBothIcons: Story = {
  args: { iconLeft: Download, iconRight: ArrowRight, children: "Download" },
};

export const DestructiveWithIcon: Story = {
  args: { variant: "destructive", iconLeft: Trash2, children: "Delete" },
};

// --- State stories ---

export const Disabled: Story = {
  args: { isDisabled: true, children: "Disabled" },
};

export const Loading: Story = {
  args: { isLoading: true, children: "Loading\u2026" },
};

export const LoadingWithIcon: Story = {
  args: { isLoading: true, iconLeft: Mail, children: "Sending\u2026" },
};

// --- Playground ---

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    isLoading: false,
    isDisabled: false,
    children: "Playground",
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
  "neutral",
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
            <Button key={`${variant}-${size}`} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
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
