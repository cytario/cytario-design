import type React from "react";
import {
  DialogTrigger,
  Popover as AriaPopover,
  Dialog as AriaDialog,
  Button as AriaButton,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

export interface PopoverProps {
  /** Controls open state (uncontrolled by default via DialogTrigger) */
  isOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  /** Additional CSS classes for the trigger wrapper */
  className?: string;
}

export interface PopoverContentProps {
  /** Placement relative to the trigger element */
  placement?: AriaPopoverProps["placement"];
  /** Offset from the trigger in pixels */
  offset?: number;
  /** Additional CSS classes */
  className?: string;
  /** Content to render inside the popover. Can be a render function receiving { close }. */
  children:
    | React.ReactNode
    | ((opts: { close: () => void }) => React.ReactNode);
}

/**
 * Popover root -- wraps React Aria's DialogTrigger.
 */
export function Popover({ children, isOpen, onOpenChange }: PopoverProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
    </DialogTrigger>
  );
}

/**
 * PopoverTrigger -- wraps the child in a React Aria Button so it
 * participates in DialogTrigger's open/close handling.
 *
 * Renders as an unstyled inline element. Pass your visual trigger
 * (text, icon, swatch) as children.
 */
export function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  return (
    <AriaButton
      className={[
        "inline-flex items-center bg-transparent border-none p-0 outline-none cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:rounded-[var(--border-radius-sm)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </AriaButton>
  );
}

/**
 * PopoverContent -- the floating panel anchored to the trigger.
 * Built on React Aria's Popover + Dialog for accessible focus management.
 */
export function PopoverContent({
  placement = "bottom",
  offset: offsetPx = 8,
  className,
  children,
}: PopoverContentProps) {
  return (
    <AriaPopover
      placement={placement}
      offset={offsetPx}
      className={[
        "z-50",
        "bg-[var(--color-surface-default)] border border-[var(--color-border-default)]",
        "rounded-[var(--border-radius-md)] shadow-lg",
        "entering:animate-in entering:fade-in entering:duration-150",
        "exiting:animate-out exiting:fade-out exiting:duration-100",
        "entering:placement-top:slide-in-from-bottom-1",
        "entering:placement-bottom:slide-in-from-top-1",
        "entering:placement-left:slide-in-from-right-1",
        "entering:placement-right:slide-in-from-left-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AriaDialog className="outline-none">
        {({ close }) => (
          <>
            {typeof children === "function"
              ? children({ close })
              : children}
          </>
        )}
      </AriaDialog>
    </AriaPopover>
  );
}
