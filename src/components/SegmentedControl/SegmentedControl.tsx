import { createContext, useContext, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  ToggleButtonGroup as AriaToggleButtonGroup,
  ToggleButton as AriaToggleButton,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
  type Key,
} from "react-aria-components";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type SegmentedControlSize = "sm" | "md" | "lg";
export type SegmentedControlSelectionMode = "single" | "none";

interface SegmentedControlContextValue {
  size: SegmentedControlSize;
}

const SegmentedControlContext = createContext<SegmentedControlContextValue>({
  size: "md",
});

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const sizeStyles: Record<SegmentedControlSize, string> = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

// ---------------------------------------------------------------------------
// SegmentedControl (group)
// ---------------------------------------------------------------------------

export interface SegmentedControlProps
  extends Omit<
    AriaToggleButtonGroupProps,
    "className" | "selectionMode" | "selectedKeys" | "defaultSelectedKeys" | "onSelectionChange"
  > {
  /** Size preset for all items */
  size?: SegmentedControlSize;
  /** Selection behavior: "single" keeps one item selected, "none" means buttons fire actions without staying selected */
  selectionMode?: SegmentedControlSelectionMode;
  /** The currently selected keys (controlled, only for selectionMode="single") */
  selectedKeys?: Iterable<Key>;
  /** The initial selected keys (uncontrolled, only for selectionMode="single") */
  defaultSelectedKeys?: Iterable<Key>;
  /** Called when selection changes (only for selectionMode="single") */
  onSelectionChange?: (keys: Set<Key>) => void;
  /** Additional CSS classes */
  className?: string;
  children: ReactNode;
}

export function SegmentedControl({
  size = "md",
  selectionMode = "single",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  className,
  children,
  ...props
}: SegmentedControlProps) {
  // For "none" mode: pass selectionMode="single" to RAC but force selection to empty
  const isNoneMode = selectionMode === "none";

  return (
    <SegmentedControlContext.Provider value={{ size }}>
      <AriaToggleButtonGroup
        {...props}
        selectionMode="single"
        selectedKeys={isNoneMode ? new Set<Key>() : selectedKeys}
        defaultSelectedKeys={isNoneMode ? undefined : defaultSelectedKeys}
        onSelectionChange={isNoneMode ? undefined : onSelectionChange}
        className={twMerge(
          "inline-flex items-center rounded-[var(--border-radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-0.5 gap-0.5",
          className,
        )}
      >
        {children}
      </AriaToggleButtonGroup>
    </SegmentedControlContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// SegmentedControlItem (button)
// ---------------------------------------------------------------------------

export interface SegmentedControlItemProps
  extends Omit<AriaToggleButtonProps, "className"> {
  /** Additional CSS classes */
  className?: string;
}

export function SegmentedControlItem({
  className,
  ...props
}: SegmentedControlItemProps) {
  const { size } = useContext(SegmentedControlContext);

  return (
    <AriaToggleButton
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
          sizeStyles[size],

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
    />
  );
}
