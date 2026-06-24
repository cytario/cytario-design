import type React from "react";
import { MenuItem as AriaMenuItem } from "react-aria-components";
import { Icon, type IconValue } from "../Icon";

export interface MenuItemProps {
  id: string;
  /** Item label */
  children: React.ReactNode;
  icon?: IconValue;
  /** End-slot content: badges, shortcuts, chevrons */
  endContent?: React.ReactNode;
  onAction?: () => void;
  href?: string;
  target?: string;
  isDisabled?: boolean;
  isDanger?: boolean;
  /** Accessible text override for complex children */
  textValue?: string;
  className?: string;
}

export function MenuItem({
  id,
  children,
  icon,
  endContent,
  onAction,
  href,
  target,
  isDisabled,
  isDanger,
  textValue,
  className,
}: MenuItemProps) {
  return (
    <AriaMenuItem
      id={id}
      href={href}
      target={target}
      isDisabled={isDisabled}
      onAction={onAction}
      textValue={textValue}
      className={[
        "flex items-center gap-2 px-3 py-2 text-sm outline-none cursor-default",
        "transition-colors",
        "focus:bg-muted",
        "hover:bg-muted",
        "disabled:opacity-50 disabled:pointer-events-none",
        isDanger
          ? "text-destructive"
          : "text-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <Icon icon={icon} size="sm" />}
      <span className="flex-1">{children}</span>
      {endContent && (
        <span className="ml-auto flex items-center">{endContent}</span>
      )}
    </AriaMenuItem>
  );
}
