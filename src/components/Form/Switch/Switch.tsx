import type React from "react";
import {
  SwitchField,
  SwitchButton,
  type SwitchFieldProps as AriaSwitchFieldProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

type PresetColor = "primary" | "success" | "destructive";

export interface SwitchProps extends Omit<
  AriaSwitchFieldProps,
  "children" | "className"
> {
  children?: React.ReactNode;
  color?: string;
  className?: string;
}

export function Switch({
  children,
  color = "var(--color-primary)",
  className,
  ...props
}: SwitchProps) {
  return (
    <SwitchField {...props}>
      <SwitchButton className="relative cursor-pointer">
        {({ isSelected, isFocusVisible }) => (
          /* Track */
          <div
            className={twMerge(
              `
                flex items-center
                border-2 border-border
                w-9 h-5 rounded-full transition-colors shrink-0
              `,
              isFocusVisible && "ring-2 ring-ring ring-offset-2",
              !isSelected && "bg-border",
            )}
            style={isSelected ? { backgroundColor: color } : undefined}
          >
            {/* Knob */}
            <div
              className={twMerge(
                `
                  absolute top-0 left-0 w-5 h-5
                  rounded-full
                  transition-transform
                  border-2 border-border
                  
                `,
                isSelected
                  ? "translate-x-4 bg-card"
                  : "translate-x-0 bg-background",
              )}
            />
          </div>
        )}
      </SwitchButton>
      {children && <span>{children}</span>}
    </SwitchField>
  );
}
