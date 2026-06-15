import type React from "react";
import {
  DialogTrigger,
  Popover as AriaPopover,
  Button as AriaButton,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface PopoverProps {
  /** Controls open state (uncontrolled by default via DialogTrigger) */
  isOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

/** Provides open/close state to a paired PopoverTrigger and PopoverContent. */
export function Popover({ children, isOpen, onOpenChange }: PopoverProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
    </DialogTrigger>
  );
}

export interface PopoverTriggerProps {
  children: React.ReactNode;
  /** Additional CSS classes for the trigger wrapper */
  className?: string;
}

/** Wraps its child in an AriaButton so it can toggle the parent Popover. */
export function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const cx = `
    inline-flex items-center bg-transparent border-none p-0 outline-none cursor-pointer
    focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm
  `;

  return <AriaButton className={twMerge(cx, className)}>{children}</AriaButton>;
}

export interface PopoverContentProps {
  placement?: AriaPopoverProps["placement"];
  offset?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Floating panel anchored to the trigger. Provides focus trap,
 * Escape-to-close, focus restore, and outside-click dismiss via RAC's
 * Popover (no Dialog wrapper needed for those behaviors).
 */
export function PopoverContent({
  placement = "bottom",
  offset: offsetPx = 8,
  className,
  children,
  ...rest
}: PopoverContentProps) {
  const cx = `
    z-50
    bg-background
    border border-border
    rounded-md shadow-lg
    entering:animate-in entering:fade-in entering:duration-300
    exiting:animate-out exiting:fade-out exiting:duration-300
    entering:placement-top:slide-in-from-bottom-1
    entering:placement-bottom:slide-in-from-top-1
    entering:placement-left:slide-in-from-right-1
    entering:placement-right:slide-in-from-left-1
  `;
  return (
    <AriaPopover
      {...rest}
      placement={placement}
      offset={offsetPx}
      className={twMerge(cx, className)}
    >
      {children}
    </AriaPopover>
  );
}
