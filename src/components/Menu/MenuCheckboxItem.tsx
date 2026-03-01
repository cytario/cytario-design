import type React from "react";
import { MenuItem as AriaMenuItem } from "react-aria-components";
import { Check } from "lucide-react";

export interface MenuCheckboxItemProps {
  id: string;
  /** Item label */
  children: React.ReactNode;
  /** Accessible text override for complex children */
  textValue?: string;
  isDisabled?: boolean;
  className?: string;
}

export function MenuCheckboxItem({
  id,
  children,
  textValue,
  isDisabled,
  className,
}: MenuCheckboxItemProps) {
  return (
    <AriaMenuItem
      id={id}
      textValue={textValue}
      isDisabled={isDisabled}
      className={({ isSelected }) =>
        [
          "flex items-center gap-2 px-3 py-2 text-sm outline-none cursor-default",
          "transition-colors",
          "focus:bg-[var(--color-surface-muted)]",
          "hover:bg-[var(--color-surface-muted)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          "text-[var(--color-text-primary)]",
          isSelected ? "font-[number:var(--font-weight-medium)]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")
      }
    >
      {({ isSelected }) => (
        <>
          <span className="flex items-center justify-center w-4 h-4 shrink-0">
            {isSelected && (
              <Check size={14} className="text-[var(--color-action-primary)]" aria-hidden="true" />
            )}
          </span>
          <span className="flex-1">{children}</span>
        </>
      )}
    </AriaMenuItem>
  );
}
