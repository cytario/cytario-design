import { createContext, useContext, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  type TabsProps as AriaTabsProps,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabPanelProps as AriaTabPanelProps,
  type Key,
} from "react-aria-components";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type TabsVariant = "underline" | "pills" | "unstyled";
export type TabsSize = "sm" | "md" | "lg";

interface TabsContextValue {
  variant: TabsVariant;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextValue>({
  variant: "underline",
  size: "md",
});

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const sizeStyles: Record<TabsSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

// ---------------------------------------------------------------------------
// Tabs (root)
// ---------------------------------------------------------------------------

export interface TabsProps
  extends Omit<AriaTabsProps, "className" | "orientation"> {
  /** Visual style variant */
  variant?: TabsVariant;
  /** Size preset */
  size?: TabsSize;
  /** Layout orientation */
  orientation?: "horizontal" | "vertical";
  /** Additional CSS classes */
  className?: string;
  children: ReactNode;
}

export function Tabs({
  variant = "underline",
  size = "md",
  orientation = "horizontal",
  className,
  children,
  ...props
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant, size }}>
      <AriaTabs
        {...props}
        orientation={orientation}
        className={twMerge(
          orientation === "vertical" ? "flex" : "",
          className,
        )}
      >
        {children}
      </AriaTabs>
    </TabsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// TabList
// ---------------------------------------------------------------------------

export interface TabListProps<T extends object>
  extends Omit<AriaTabListProps<T>, "className"> {
  /** Additional CSS classes */
  className?: string;
}

export function TabList<T extends object>({
  className,
  ...props
}: TabListProps<T>) {
  const { variant } = useContext(TabsContext);

  const baseStyles =
    variant === "unstyled"
      ? "flex items-center"
      : variant === "underline"
        ? "flex items-center border-b border-[var(--color-border-default)]"
        : "inline-flex items-center bg-[var(--color-surface-muted)] rounded-[var(--border-radius-lg)] p-1 gap-1";

  // Vertical orientation overrides
  const verticalStyles =
    variant === "unstyled"
      ? "flex-col"
      : variant === "underline"
        ? "flex-col border-b-0 border-r border-[var(--color-border-default)]"
        : "flex-col";

  return (
    <AriaTabList
      {...props}
      className={({ orientation }) =>
        twMerge(
          baseStyles,
          orientation === "vertical" ? verticalStyles : "",
          className,
        )
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

export interface TabProps extends Omit<AriaTabProps, "className"> {
  /** Additional CSS classes */
  className?: string;
}

export function Tab({ className, ...props }: TabProps) {
  const { variant, size } = useContext(TabsContext);

  return (
    <AriaTab
      {...props}
      className={({ isSelected, isDisabled, isHovered, isPressed }) => {
        if (variant === "unstyled") {
          return twMerge(
            "cursor-pointer outline-none",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
            isDisabled ? "opacity-50 pointer-events-none" : "",
            className,
          );
        }

        return twMerge(
          // Base
          "cursor-pointer outline-none transition-colors",
          "font-[var(--font-weight-medium)]",

          // Focus ring
          "focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",

          // Disabled
          isDisabled ? "opacity-50 pointer-events-none" : "",

          // Size
          sizeStyles[size],

          // Variant-specific styles
          ...getTabVariantStyles(variant, {
            isSelected,
            isHovered,
            isPressed,
            isDisabled,
          }),

          className,
        );
      }}
    />
  );
}

function getTabVariantStyles(
  variant: TabsVariant,
  state: {
    isSelected: boolean;
    isHovered: boolean;
    isPressed: boolean;
    isDisabled: boolean;
  },
): string[] {
  if (variant === "underline") {
    return [
      // Shape
      "relative rounded-t-[var(--border-radius-sm)]",

      // Color states
      state.isSelected
        ? [
            "text-[var(--color-teal-700)] font-[var(--font-weight-semibold)]",
            // Bottom indicator via pseudo-element
            "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--color-teal-600)]",
          ].join(" ")
        : state.isPressed
          ? "text-[var(--color-text-primary)] bg-[var(--color-surface-muted)]"
          : state.isHovered
            ? "text-[var(--color-text-primary)] bg-[var(--color-surface-subtle)]"
            : "text-[var(--color-text-secondary)] bg-transparent",
    ];
  }

  // Pills variant
  return [
    // Shape
    "rounded-[var(--border-radius-md)]",

    // Color states
    state.isSelected
      ? "text-[var(--color-text-primary)] font-[var(--font-weight-semibold)] bg-[var(--color-surface-default)] shadow-sm"
      : state.isPressed
        ? "text-[var(--color-text-primary)] bg-[var(--color-surface-subtle)] shadow-none"
        : state.isHovered
          ? "text-[var(--color-text-primary)] bg-[var(--color-surface-pressed)]"
          : "text-[var(--color-text-secondary)] bg-transparent",
  ];
}

// ---------------------------------------------------------------------------
// TabPanel
// ---------------------------------------------------------------------------

export interface TabPanelProps extends Omit<AriaTabPanelProps, "className"> {
  /** Additional CSS classes */
  className?: string;
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  const { variant } = useContext(TabsContext);

  return (
    <AriaTabPanel
      {...props}
      className={twMerge(
        variant === "unstyled" ? "outline-none" : "mt-4 outline-none",
        className,
      )}
    />
  );
}
