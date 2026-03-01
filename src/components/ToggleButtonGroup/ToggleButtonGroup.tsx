import { createContext, useContext, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  RadioGroup as AriaRadioGroup,
  Radio as AriaRadio,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToggleButtonGroupSize = "sm" | "md" | "lg";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ToggleButtonGroupContextValue {
  size: ToggleButtonGroupSize;
}

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue>({
  size: "md",
});

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const sizeStyles: Record<ToggleButtonGroupSize, string> = {
  sm: "px-2.5 py-1 text-xs gap-1",
  md: "px-3 py-1.5 text-sm gap-1.5",
  lg: "px-4 py-2 text-base gap-2",
};

const iconOnlySizeStyles: Record<ToggleButtonGroupSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

// ---------------------------------------------------------------------------
// ToggleButtonGroup
// ---------------------------------------------------------------------------

export interface ToggleButtonGroupProps
  extends Omit<AriaRadioGroupProps, "className" | "children" | "orientation"> {
  /** Size preset for all items */
  size?: ToggleButtonGroupSize;
  /** Additional CSS classes */
  className?: string;
  children: ReactNode;
}

export function ToggleButtonGroup({
  size = "md",
  className,
  children,
  ...props
}: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroupContext.Provider value={{ size }}>
      <AriaRadioGroup
        {...props}
        orientation="horizontal"
        className={twMerge(
          "inline-flex items-center rounded-[var(--border-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-0.5 gap-0.5",
          className,
        )}
      >
        {children}
      </AriaRadioGroup>
    </ToggleButtonGroupContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// ToggleButtonGroupItem
// ---------------------------------------------------------------------------

export interface ToggleButtonGroupItemProps
  extends Omit<AriaRadioProps, "className" | "children"> {
  /** Label content — text or icon */
  children: ReactNode;
  /** When true, applies square icon-only sizing */
  isIconOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToggleButtonGroupItem({
  children,
  isIconOnly,
  className,
  ...props
}: ToggleButtonGroupItemProps) {
  const { size } = useContext(ToggleButtonGroupContext);

  return (
    <AriaRadio
      {...props}
      className={({ isSelected, isHovered, isPressed, isDisabled }) =>
        twMerge(
          // Base layout
          "inline-flex items-center justify-center",
          "rounded-[var(--border-radius-md)]",
          "font-[var(--font-weight-medium)]",
          "outline-none transition-colors cursor-pointer",

          // Focus ring
          "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-1",

          // Disabled
          isDisabled && "opacity-50 pointer-events-none",

          // Size
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],

          // Selected state
          isSelected
            ? "bg-[var(--color-surface-default)] text-[var(--color-text-primary)] shadow-sm font-[var(--font-weight-semibold)]"
            : isPressed
              ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]"
              : isHovered
                ? "bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)]"
                : "bg-transparent text-[var(--color-text-secondary)]",

          className,
        )
      }
    >
      {children}
    </AriaRadio>
  );
}
