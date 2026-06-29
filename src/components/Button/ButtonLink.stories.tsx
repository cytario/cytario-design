import { Fragment } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { ArrowRight, Download } from "lucide-react";
import { ButtonLink } from "./Button";

const meta: Meta<typeof ButtonLink> = {
  title: "Components/ButtonLink",
  component: ButtonLink,
  argTypes: {
    variant: { control: "select" },
    size: { control: "select" },
  },
  args: {
    children: "Link",
    href: "#",
  },
};

export default meta;
type Story = StoryObj<typeof ButtonLink>;

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
      {variants.map((variant) => (
        <Fragment key={variant}>
          <span style={labelStyle}>{variant}</span>
          {sizes.map((size) => (
            <ButtonLink
              key={`${variant}-${size}`}
              href="#"
              variant={variant}
              size={size}
            >
              Link
            </ButtonLink>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
    isLoading: false,
    isDisabled: false,
    children: "Playground",
    href: "#",
  },
};

// --- Icons (not covered by the variant grid) ---

export const WithIconLeft: Story = {
  args: { iconLeft: Download, children: "Download" },
};

export const WithIconRight: Story = {
  args: { iconRight: ArrowRight, children: "Next Page" },
};
