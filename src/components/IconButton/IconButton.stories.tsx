import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronsRight,
  Download,
  ExternalLink,
  Filter,
  FilterX,
  Fullscreen,
  Heart,
  Info,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
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

// --- Real-world usage stories (from cytario-web) ---

export const UserMenu: Story = {
  name: "User Menu Trigger",
  args: {
    icon: User,
    "aria-label": "User menu",
    variant: "ghost",
  },
};

export const ClearSearch: Story = {
  name: "Clear Search",
  args: {
    icon: X,
    "aria-label": "Clear search",
    variant: "default",
  },
};

export const ResetTable: Story = {
  name: "Reset Table Defaults",
  args: {
    icon: RotateCcw,
    "aria-label": "Reset column widths and sorting to defaults",
    variant: "secondary",
  },
};

export const SortColumnUnsorted: Story = {
  name: "Sort Column (Unsorted)",
  args: {
    icon: ArrowUpDown,
    "aria-label": "Sort by Name",
    variant: "ghost",
  },
};

export const SortColumnAscending: Story = {
  name: "Sort Column (Ascending)",
  args: {
    icon: ArrowUp,
    "aria-label": "Sort by Name",
    variant: "ghost",
  },
};

export const SortColumnDescending: Story = {
  name: "Sort Column (Descending)",
  args: {
    icon: ArrowDown,
    "aria-label": "Sort by Name",
    variant: "ghost",
  },
};

export const ShowInfo: Story = {
  name: "Show Node Info",
  args: {
    icon: Info,
    "aria-label": "Show Info",
    variant: "ghost",
  },
};

export const ResetViewState: Story = {
  name: "Reset View State",
  args: {
    icon: Fullscreen,
    "aria-label": "Reset View State",
    variant: "default",
  },
};

export const ToggleFeatureBar: Story = {
  name: "Toggle Feature Bar",
  args: {
    icon: ChevronsRight,
    "aria-label": "Toggle Feature Bar",
    size: "lg",
    variant: "default",
  },
};

export const ShowDisabledChannels: Story = {
  name: "Show Disabled Channels",
  args: {
    icon: FilterX,
    "aria-label": "Show disabled channels",
    variant: "default",
  },
};

export const HideDisabledChannels: Story = {
  name: "Hide Disabled Channels",
  args: {
    icon: Filter,
    "aria-label": "Hide disabled channels",
    variant: "default",
  },
};

export const RemoveOverlay: Story = {
  name: "Remove Overlay",
  args: {
    icon: X,
    "aria-label": "Remove overlay",
    variant: "default",
  },
};

export const OpenExternalFile: Story = {
  name: "Open External File",
  args: {
    icon: ExternalLink,
    "aria-label": "Open file",
    variant: "default",
  },
};

export const ResetContrast: Story = {
  name: "Reset Contrast",
  args: {
    icon: RotateCcw,
    "aria-label": "Reset contrast",
    variant: "default",
  },
};

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
