import type React from "react";
import { type Key, type Selection } from "react-aria-components";
import {
  MenuTrigger,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Popover,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { Icon, type IconValue } from "../Icon";
import { popoverStyles } from "./menuStyles";
import {
  TriggerThemeProvider,
  useTriggerTheme,
} from "../Popover/useTriggerTheme";

export interface MenuItemData {
  id: string;
  label: string;
  icon?: IconValue;
  onAction?: () => void;
  /** When set, renders the menu item as a navigational link */
  href?: string;
  /** Link target, e.g. "_blank" for external links */
  target?: string;
  isDisabled?: boolean;
  /** Optional end content rendered after the label (e.g. badge, shortcut hint) */
  endContent?: React.ReactNode;
}

export interface MenuProps {
  /** Items for simple flat menus (backward compat). Mutually exclusive with content. */
  items?: MenuItemData[];
  /** Menu content for composition mode — MenuSection, MenuItem, MenuSeparator */
  content?: React.ReactNode;
  /** The element that toggles the menu (button, icon button, …). */
  children: React.ReactNode;
  /** Called when any item is activated */
  onAction?: (key: Key) => void;
  /** Selection mode for checkbox-style menus */
  selectionMode?: "single" | "multiple" | "none";
  /** Controlled selection */
  selectedKeys?: Iterable<Key>;
  /** Default selection (uncontrolled) */
  defaultSelectedKeys?: Iterable<Key>;
  /** Called when selection changes */
  onSelectionChange?: (keys: Selection) => void;
  /** Additional classes for the popover chrome */
  className?: string;
}

/**
 * The trigger + portaled popover. Rendered inside TriggerThemeProvider so
 * the popover can pick up the themed DOM context the menu was mounted in
 * (React-Aria renders the popover outside this subtree; the data-theme it
 * carries is what keeps its tokens correct in themed containers such as
 * Storybook's side-by-side view).
 */
function MenuBody({ className, children, ...props }: MenuProps) {
  const triggerTheme = useTriggerTheme();
  const selectionProps =
    props.selectionMode && props.selectionMode !== "none"
      ? {
          selectionMode: props.selectionMode,
          selectedKeys: props.selectedKeys,
          defaultSelectedKeys: props.defaultSelectedKeys,
          onSelectionChange: props.onSelectionChange,
        }
      : {};

  return (
    <MenuTrigger>
      {children}
      <Popover
        data-theme={triggerTheme}
        className={twMerge(popoverStyles, className)}
      >
        {props.items ? (
          <AriaMenu
            items={props.items}
            onAction={(key) => {
              const item = props.items?.find((i) => i.id === key);
              item?.onAction?.();
              props.onAction?.(key);
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
                  "focus:bg-muted",
                  "hover:bg-muted",
                  "disabled:opacity-50 disabled:pointer-events-none",
                  "text-foreground",
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
            onAction={(key) => props.onAction?.(key)}
            {...selectionProps}
            className="outline-none"
          >
            {props.content}
          </AriaMenu>
        )}
      </Popover>
    </MenuTrigger>
  );
}

export function Menu(props: MenuProps) {
  return (
    <TriggerThemeProvider>
      <MenuBody {...props} />
    </TriggerThemeProvider>
  );
}
