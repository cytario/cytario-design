import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import {
  Copy,
  Edit,
  ExternalLink,
  LogOut,
  MoreVertical,
  Settings,
  Trash2,
  Download,
  User,
} from "lucide-react";
import { Menu } from "./Menu";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

// --- Real-world usage stories (from cytario-web) ---

export const UserMenu: Story = {
  name: "User Menu",
  args: {
    items: [
      {
        id: "account-settings",
        label: "Account Settings",
        icon: Settings,
        href: "https://auth.cytario.com/account",
        target: "_blank",
      },
      {
        id: "logout",
        label: "Logout",
        icon: LogOut,
        href: "/logout",
      },
    ],
    children: (
      <IconButton
        icon={User}
        aria-label="User menu"
        variant="ghost"
        className="flex-shrink-0 w-8 h-8 text-white"
      />
    ),
  },
};

// --- Generic stories ---

export const Default: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: Edit, onAction: fn() },
      { id: "copy", label: "Copy", icon: Copy, onAction: fn() },
      { id: "download", label: "Download", icon: Download, onAction: fn() },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        isDanger: true,
        onAction: fn(),
      },
    ],
    children: <Button variant="secondary">Actions</Button>,
  },
};

export const WithIconButtonTrigger: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: Edit },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "delete", label: "Delete", icon: Trash2, isDanger: true },
    ],
    children: (
      <IconButton
        icon={MoreVertical}
        aria-label="More actions"
        variant="ghost"
      />
    ),
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: Edit },
      { id: "copy", label: "Copy", icon: Copy, isDisabled: true },
      { id: "download", label: "Download", icon: Download },
    ],
    children: <Button variant="secondary">Options</Button>,
  },
};

export const TextOnly: Story = {
  args: {
    items: [
      { id: "option-1", label: "Option 1" },
      { id: "option-2", label: "Option 2" },
      { id: "option-3", label: "Option 3" },
    ],
    children: <Button variant="ghost">Menu</Button>,
  },
};

export const WithLinks: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: Edit, onAction: fn() },
      { id: "settings", label: "Settings", icon: Settings, onAction: fn() },
      {
        id: "keycloak",
        label: "Open Keycloak",
        icon: ExternalLink,
        href: "https://keycloak.example.com/admin",
        target: "_blank",
      },
      {
        id: "docs",
        label: "Documentation",
        icon: ExternalLink,
        href: "https://docs.example.com",
        target: "_blank",
      },
    ],
    children: <Button variant="secondary">User Menu</Button>,
  },
};

export const Playground: Story = {
  args: {
    items: [
      { id: "edit", label: "Edit", icon: Edit },
      { id: "copy", label: "Copy", icon: Copy },
      { id: "delete", label: "Delete", icon: Trash2, isDanger: true },
    ],
    children: <Button>Open Menu</Button>,
  },
};
