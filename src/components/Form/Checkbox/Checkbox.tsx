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
        "group flex items-center gap-2 text-sm text-foreground cursor-pointer",
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
              "rounded-sm border transition-colors",
              "group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
              isSelected || isIndeterminate
                ? "bg-primary border-primary"
                : "bg-background border-border group-hover:border-border",
            ].join(" ")}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
            )}
            {isIndeterminate && (
              <div className="w-3 h-0.5 bg-primary-foreground rounded-full" />
            )}
          </div>
          {children && <span>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  );
}
