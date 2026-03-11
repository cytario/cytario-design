import type React from "react";
import type { LucideIcon } from "lucide-react";
import type { Selection } from "react-aria-components";
import {
  MenuTrigger,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Popover,
} from "react-aria-components";
import { Icon } from "../Icon";

export interface MenuItemData {
  id: string;
  label: string;
  icon?: LucideIcon;
  onAction?: () => void;
  /** When set, renders the menu item as a navigational link */
  href?: string;
  /** Link target, e.g. "_blank" for external links */
  target?: string;
  isDisabled?: boolean;
  isDanger?: boolean;
  /** Optional end content rendered after the label (e.g. badge, shortcut hint) */
  endContent?: React.ReactNode;
}

export interface MenuProps {
  /** Items for simple flat menus (backward compat). Mutually exclusive with content. */
  items?: MenuItemData[];
  /** Menu content for composition mode — MenuSection, MenuItem, MenuSeparator */
  content?: React.ReactNode;
  /** Trigger element (typically a Button or IconButton) */
  children: React.ReactNode;
  /** Called when any MenuItem is activated (receives the item key) */
  onAction?: (key: string) => void;
  /** Selection mode: "none" (default), "single", or "multiple" for checkbox-style items */
  selectionMode?: "none" | "single" | "multiple";
  /** Currently selected keys (controlled) */
  selectedKeys?: Selection;
  /** Default selected keys (uncontrolled) */
  defaultSelectedKeys?: Selection;
  /** Called when selection changes */
  onSelectionChange?: (keys: Selection) => void;
  /** Additional CSS classes for the menu popover */
  className?: string;
}

const popoverStyles = [
  "bg-(--color-surface-default) rounded-md",
  "shadow-lg border border-(--color-border-default)",
  "py-1 min-w-48",
  "entering:animate-in entering:fade-in entering:zoom-in-95",
  "exiting:animate-out exiting:fade-out exiting:zoom-out-95",
].join(" ");

export function Menu({
  items,
  content,
  children,
  onAction,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  className,
}: MenuProps) {
  const selectionProps = selectionMode && selectionMode !== "none"
    ? { selectionMode, selectedKeys, defaultSelectedKeys, onSelectionChange }
    : {};

  return (
    <MenuTrigger>
      {children}
      <Popover
        className={[popoverStyles, className].filter(Boolean).join(" ")}
      >
        {items ? (
          <AriaMenu
            items={items}
            onAction={(key) => {
              const item = items.find((i) => i.id === key);
              item?.onAction?.();
              onAction?.(key as string);
            }}
            {...selectionProps}
            className="outline-none"
          >
            {(item) => (
              <AriaMenuItem
                id={item.id}
                href={item.href}
                target={item.target}
                isDisabled={item.isDisabled}
                className={[
                  "flex items-center gap-2 px-3 py-2 text-sm outline-none cursor-default",
                  "transition-colors",
                  "focus:bg-(--color-surface-muted)",
                  "hover:bg-(--color-surface-muted)",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  item.isDanger
                    ? "text-(--color-text-danger)"
                    : "text-(--color-text-primary)",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.icon && <Icon icon={item.icon} size="sm" />}
                <span className="flex-1">{item.label}</span>
                {item.endContent && (
                  <span className="ml-auto flex items-center">
                    {item.endContent}
                  </span>
                )}
              </AriaMenuItem>
            )}
          </AriaMenu>
        ) : (
          <AriaMenu
            onAction={(key) => onAction?.(key as string)}
            {...selectionProps}
            className="outline-none"
          >
            {content}
          </AriaMenu>
        )}
      </Popover>
    </MenuTrigger>
  );
}
