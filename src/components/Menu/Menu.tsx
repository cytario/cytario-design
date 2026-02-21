import type React from "react";
import type { LucideIcon } from "lucide-react";
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
  isDisabled?: boolean;
  isDanger?: boolean;
}

export interface MenuProps {
  /** Items to render in the menu */
  items: MenuItemData[];
  /** Trigger element (typically a Button or IconButton) */
  children: React.ReactNode;
  /** Additional CSS classes for the menu popover */
  className?: string;
}

export function Menu({ items, children, className }: MenuProps) {
  return (
    <MenuTrigger>
      {children}
      <Popover
        className={[
          "bg-[var(--color-surface-primary)] rounded-[var(--border-radius-md)]",
          "shadow-lg border border-[var(--color-border-default)]",
          "py-1 min-w-48",
          "entering:animate-in entering:fade-in entering:zoom-in-95",
          "exiting:animate-out exiting:fade-out exiting:zoom-out-95",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <AriaMenu
          items={items}
          onAction={(key) => {
            const item = items.find((i) => i.id === key);
            item?.onAction?.();
          }}
          className="outline-none"
        >
          {(item) => (
            <AriaMenuItem
              id={item.id}
              isDisabled={item.isDisabled}
              className={[
                "flex items-center gap-2 px-3 py-2 text-sm outline-none cursor-default",
                "transition-colors",
                "focus:bg-[var(--color-neutral-100)]",
                "hover:bg-[var(--color-neutral-100)]",
                "disabled:opacity-50 disabled:pointer-events-none",
                item.isDanger
                  ? "text-[var(--color-text-danger)]"
                  : "text-[var(--color-text-primary)]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.icon && <Icon icon={item.icon} size="sm" />}
              {item.label}
            </AriaMenuItem>
          )}
        </AriaMenu>
      </Popover>
    </MenuTrigger>
  );
}
