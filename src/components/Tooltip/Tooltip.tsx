import type React from "react";
import {
  Tooltip as AriaTooltip,
  TooltipTrigger,
  type TooltipProps as AriaTooltipProps,
} from "react-aria-components";

export interface TooltipProps {
  /** Tooltip text content */
  content: string;
  /** Trigger element */
  children: React.ReactElement;
  /** Placement relative to trigger */
  placement?: "top" | "bottom" | "left" | "right";
  /** Delay in ms before showing (default 500) */
  delay?: number;
  /** Additional CSS classes for the tooltip */
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 500,
  className,
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <AriaTooltip
        placement={placement}
        className={[
          "bg-[var(--color-surface-overlay)] backdrop-blur-sm",
          "text-[var(--color-text-inverse)] text-sm",
          "px-3 py-1.5",
          "rounded-md",
          "max-w-xs",
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
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
