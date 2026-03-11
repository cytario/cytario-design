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
          "inline-flex items-center rounded-lg border border-(--color-border-default) bg-(--color-surface-muted) p-0.5 gap-0.5",
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
          "rounded-md",
          "font-medium",
          "outline-none transition-colors cursor-pointer",

          // Focus ring
          "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-1",

          // Disabled
          isDisabled && "opacity-50 pointer-events-none",

          // Size
          isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],

          // Selected state
          isSelected
            ? "bg-(--color-surface-default) text-(--color-text-primary) shadow-sm font-semibold"
            : isPressed
              ? "bg-(--color-surface-subtle) text-(--color-text-primary)"
              : isHovered
                ? "bg-(--color-surface-subtle) text-(--color-text-primary)"
                : "bg-transparent text-(--color-text-secondary)",

          className,
        )
      }
    >
      {children}
    </AriaRadio>
  );
}
