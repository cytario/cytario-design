import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import type { Selection } from "react-aria-components";
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
  Shield,
  Columns3,
} from "lucide-react";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuCheckboxItem } from "./MenuCheckboxItem";
import { MenuSection } from "./MenuSection";
import { MenuHeader } from "./MenuHeader";
import { MenuSeparator } from "./MenuSeparator";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Badge } from "../Badge";
import { GroupPill } from "../Pill";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

// --- Composition API stories ---

export const UserProfileMenu: Story = {
  name: "User Profile Menu",
  render: () => (
    <Menu
      content={
        <>
          <MenuSection aria-label="User identity">
            <MenuHeader>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-(--color-badge-purple-bg) text-(--color-badge-purple-text)">
                  <User className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-(--color-text-primary)">
                    Dr. Sarah Chen
                  </span>
                  <span className="text-xs text-(--color-text-secondary)">
                    sarah.chen@hospital.org
                  </span>
                </div>
              </div>
            </MenuHeader>
          </MenuSection>

          <MenuSeparator />

          <MenuSection header="Admin Groups">
            <MenuItem id="group-pathology" textValue="Pathology">
              <GroupPill path="/hospital/pathology" />
            </MenuItem>
            <MenuItem id="group-research" textValue="Research">
              <GroupPill path="/hospital/research/ai-lab" />
            </MenuItem>
          </MenuSection>

          <MenuSeparator />

          <MenuSection header="Account">
            <MenuItem id="settings" icon={Settings}>
              Settings
            </MenuItem>
            <MenuItem
              id="admin"
              icon={Shield}
              href="https://auth.cytario.com/admin"
              target="_blank"
              endContent={
                <span className="text-xs text-(--color-text-tertiary)">
                  External
                </span>
              }
            >
              Admin Console
            </MenuItem>
          </MenuSection>

          <MenuSeparator />

          <MenuItem id="logout" icon={LogOut} isDanger onAction={fn()}>
            Log out
          </MenuItem>
        </>
      }
    >
      <IconButton
        icon={User}
        aria-label="User menu"
        variant="ghost"
        className="flex-shrink-0 w-8 h-8"
      />
    </Menu>
  ),
};

export const WithSections: Story = {
  name: "With Sections",
  render: () => (
    <Menu
      content={
        <>
          <MenuSection header="Edit">
            <MenuItem id="cut" icon={Edit}>
              Cut
            </MenuItem>
            <MenuItem id="copy" icon={Copy}>
              Copy
            </MenuItem>
          </MenuSection>

          <MenuSeparator />

          <MenuSection header="Export">
            <MenuItem id="download" icon={Download}>
              Download
            </MenuItem>
            <MenuItem
              id="external"
              icon={ExternalLink}
              href="https://example.com"
              target="_blank"
              endContent={
                <Badge variant="teal" size="sm">
                  New
                </Badge>
              }
            >
              Open in Browser
            </MenuItem>
          </MenuSection>

          <MenuSeparator />

          <MenuItem id="delete" icon={Trash2} isDanger>
            Delete
          </MenuItem>
        </>
      }
    >
      <Button variant="secondary">Actions</Button>
    </Menu>
  ),
};

export const WithEndContent: Story = {
  name: "With End Content",
  render: () => (
    <Menu
      content={
        <>
          <MenuItem
            id="cut"
            icon={Edit}
            endContent={
              <kbd className="text-xs text-(--color-text-tertiary)">
                Cmd+X
              </kbd>
            }
          >
            Cut
          </MenuItem>
          <MenuItem
            id="copy"
            icon={Copy}
            endContent={
              <kbd className="text-xs text-(--color-text-tertiary)">
                Cmd+C
              </kbd>
            }
          >
            Copy
          </MenuItem>
          <MenuItem
            id="download"
            icon={Download}
            endContent={
              <Badge variant="purple" size="sm">
                Pro
              </Badge>
            }
          >
            Export
          </MenuItem>
        </>
      }
    >
      <Button variant="secondary">Edit</Button>
    </Menu>
  ),
};

// --- Data-driven stories (backward compatible) ---

export const UserMenu: Story = {
  name: "User Menu (items prop)",
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

export const ItemsWithEndContent: Story = {
  name: "Items Prop with End Content",
  args: {
    items: [
      {
        id: "edit",
        label: "Edit",
        icon: Edit,
        endContent: (
          <kbd className="text-xs text-(--color-text-tertiary)">
            Cmd+E
          </kbd>
        ),
      },
      {
        id: "copy",
        label: "Copy",
        icon: Copy,
        endContent: (
          <kbd className="text-xs text-(--color-text-tertiary)">
            Cmd+C
          </kbd>
        ),
      },
      {
        id: "export",
        label: "Export",
        icon: Download,
        endContent: (
          <Badge variant="purple" size="sm">
            Pro
          </Badge>
        ),
      },
    ],
    children: <Button variant="secondary">Edit</Button>,
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

// --- Checkbox menu items ---

export const ColumnVisibility: Story = {
  name: "Column Visibility (Checkbox)",
  render: function ColumnVisibilityExample() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(["name", "status", "date", "size"]),
    );

    return (
      <Menu
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        content={
          <MenuSection header="Columns">
            <MenuCheckboxItem id="name">Name</MenuCheckboxItem>
            <MenuCheckboxItem id="status">Status</MenuCheckboxItem>
            <MenuCheckboxItem id="date">Date Modified</MenuCheckboxItem>
            <MenuCheckboxItem id="size">File Size</MenuCheckboxItem>
            <MenuCheckboxItem id="type">Type</MenuCheckboxItem>
            <MenuCheckboxItem id="owner">Owner</MenuCheckboxItem>
          </MenuSection>
        }
      >
        <IconButton icon={Columns3} aria-label="Toggle columns" variant="ghost" />
      </Menu>
    );
  },
};

export const CheckboxMenuItems: Story = {
  name: "Checkbox Items (Uncontrolled)",
  render: () => (
    <Menu
      selectionMode="multiple"
      defaultSelectedKeys={new Set(["grid", "labels"])}
      content={
        <>
          <MenuCheckboxItem id="grid">Show Grid</MenuCheckboxItem>
          <MenuCheckboxItem id="labels">Show Labels</MenuCheckboxItem>
          <MenuCheckboxItem id="rulers">Show Rulers</MenuCheckboxItem>
          <MenuCheckboxItem id="guides" isDisabled>Show Guides</MenuCheckboxItem>
        </>
      }
    >
      <Button variant="secondary">View Options</Button>
    </Menu>
  ),
};

export const MixedCheckboxAndActions: Story = {
  name: "Mixed: Checkbox + Action Items",
  render: function MixedExample() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(["annotations", "heatmap"]),
    );

    return (
      <Menu
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        content={
          <>
            <MenuSection header="Overlays">
              <MenuCheckboxItem id="annotations">Annotations</MenuCheckboxItem>
              <MenuCheckboxItem id="heatmap">Heatmap</MenuCheckboxItem>
              <MenuCheckboxItem id="segmentation">Segmentation</MenuCheckboxItem>
            </MenuSection>

            <MenuSeparator />

            <MenuItem id="reset-view" icon={Settings} onAction={() => setSelectedKeys(new Set())}>
              Clear All Overlays
            </MenuItem>
          </>
        }
      >
        <Button variant="secondary">View</Button>
      </Menu>
    );
  },
};
