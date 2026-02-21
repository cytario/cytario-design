import type React from "react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<AriaCheckboxProps, "children" | "className"> {
  children?: React.ReactNode;
  className?: string;
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={[
        "group flex items-center gap-2 text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] cursor-pointer",
        "disabled:opacity-50 disabled:cursor-default",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <div
            className={[
              "flex items-center justify-center w-6 h-6 shrink-0",
              "rounded-[var(--border-radius-sm)] border transition-colors",
              "group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-border-focus)] group-focus-visible:ring-offset-2",
              isSelected || isIndeterminate
                ? "bg-[var(--color-action-primary)] border-[var(--color-action-primary)]"
                : "bg-[var(--color-surface-default)] border-[var(--color-border-default)] group-hover:border-[var(--color-border-strong)]",
            ].join(" ")}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-[var(--color-text-inverse)]" strokeWidth={3} />
            )}
            {isIndeterminate && (
              <div className="w-3 h-0.5 bg-[var(--color-text-inverse)] rounded-full" />
            )}
          </div>
          {children && <span>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  );
}
