"use client";

// React Aria re-exports for consumer integration
export { RouterProvider } from "react-aria-components";
export type { RouterConfig, Key } from "react-aria-components";

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button";

export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

export { IconButton } from "./components/IconButton";
export type { IconButtonProps } from "./components/IconButton";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Select } from "./components/Select";
export type { SelectProps, SelectItem } from "./components/Select";

export { Table, TableHeader, Column, TableBody, Row, Cell } from "./components/Table";
export type { DataTableProps, TableSize } from "./components/Table";

export { Dialog } from "./components/Dialog";
export type { DialogProps } from "./components/Dialog";

export { ToastProvider, useToast, createToastBridge } from "./components/Toast";
export type { ToastData, ToastVariant, ToastContextValue, ToastBridge } from "./components/Toast";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";

export { RadioGroup, Radio, RadioButton } from "./components/Radio";
export type { RadioGroupProps, RadioProps, RadioButtonProps } from "./components/Radio";

export { Label } from "./components/Label";
export type { LabelProps } from "./components/Label";

export { Field } from "./components/Field";
export type { FieldProps } from "./components/Field";

export { Fieldset } from "./components/Fieldset";
export type { FieldsetProps } from "./components/Fieldset";

export { InputGroup, InputGroupContext, useInputGroup } from "./components/InputGroup";
export type { InputGroupProps, GroupPosition } from "./components/InputGroup";

export { InputAddon } from "./components/InputAddon";
export type { InputAddonProps } from "./components/InputAddon";

export { Heading, H1, H2, H3 } from "./components/Heading";
export type { HeadingProps, HeadingLevel, HeadingSize } from "./components/Heading";

export { Link } from "./components/Link";
export type { LinkProps, LinkVariant } from "./components/Link";

export { Breadcrumbs } from "./components/Breadcrumbs";
export type { BreadcrumbsProps, BreadcrumbItem } from "./components/Breadcrumbs";

export { ButtonLink, IconButtonLink } from "./components/ButtonLink";
export type { ButtonLinkProps, IconButtonLinkProps } from "./components/ButtonLink";

export { ToggleButton } from "./components/ToggleButton";
export type { ToggleButtonProps, ToggleButtonVariant, ToggleButtonSize } from "./components/ToggleButton";

export { Menu } from "./components/Menu";
export type { MenuProps, MenuItemData } from "./components/Menu";

export { Popover, PopoverTrigger, PopoverContent } from "./components/Popover";
export type { PopoverProps, PopoverTriggerProps, PopoverContentProps } from "./components/Popover";

export { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
export type { TabsProps, TabListProps, TabProps, TabPanelProps, TabsVariant, TabsSize } from "./components/Tabs";

// Raw React Aria Components tab primitives (unstyled escape hatch)
export {
  Tabs as UnstyledTabs,
  TabList as UnstyledTabList,
  Tab as UnstyledTab,
  TabPanel as UnstyledTabPanel,
} from "react-aria-components";

export { Tree } from "./components/Tree";
export type { TreeProps, TreeNode, TreeApi } from "./components/Tree";

export { SegmentedControl, SegmentedControlItem } from "./components/SegmentedControl";
export type {
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlSize,
  SegmentedControlSelectionMode,
} from "./components/SegmentedControl";

export { StorageConnectionCard } from "./components/StorageConnectionCard";
export type { StorageConnectionCardProps } from "./components/StorageConnectionCard";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./components/Badge";

export { Card } from "./components/Card";
export type { CardProps, CardPadding } from "./components/Card";

export { DeltaIndicator } from "./components/DeltaIndicator";
export type { DeltaIndicatorProps, DeltaFormat, DeltaMode } from "./components/DeltaIndicator";

export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from "./components/ProgressBar";

export { Banner } from "./components/Banner";
export type { BannerProps, BannerVariant } from "./components/Banner";

export { MetricCard } from "./components/MetricCard";
export type { MetricCardProps, MetricCardSize } from "./components/MetricCard";

export { SectionHeader } from "./components/SectionHeader";
export type { SectionHeaderProps } from "./components/SectionHeader";

export { Pill, pillColorFromName } from "./components/Pill";
export type { PillProps, PillColor } from "./components/Pill";

export { GroupPill } from "./components/Pill";
export type { GroupPillProps } from "./components/Pill";

export { FormWizard, useFormWizard } from "./components/FormWizard";
export type { FormWizardProps, FormWizardContextValue } from "./components/FormWizard";

export { FormWizardProgress } from "./components/FormWizard";
export type { FormWizardProgressProps } from "./components/FormWizard";

export { FormWizardNav } from "./components/FormWizard";
export type { FormWizardNavProps } from "./components/FormWizard";

// Design tokens (TypeScript constants)
export * from "./tokens/tokens";
