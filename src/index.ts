"use client";

// React Aria re-exports for consumer integration
export { RouterProvider } from "react-aria-components";
export type { RouterConfig, Key } from "react-aria-components";

// Components
export { Button } from "./components/Button";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/Button";

export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";

export { Icon, iconRegistry } from "./components/Icon";
export type {
  IconProps,
  IconName,
  IconComponent,
  IconValue,
} from "./components/Icon";

export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

export { TruncatedText } from "./components/TruncatedText";
export type { TruncatedTextProps } from "./components/TruncatedText";

export { IconButton, IconButtonLink } from "./components/IconButton";
export type {
  IconButtonProps,
  IconButtonLinkProps,
} from "./components/IconButton";

export { Input } from "./components/Form/Input";
export type { InputProps } from "./components/Form/Input";

export { InputPassword } from "./components/Form/InputPassword";
export type { InputPasswordProps } from "./components/Form/InputPassword";

export { Select } from "./components/Form/Select";
export type { SelectProps, SelectItem } from "./components/Form/Select";

export {
  Table,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "./components/Table";
export type { DataTableProps, TableSize } from "./components/Table";

export { Dialog } from "./components/Dialog";
export type { DialogProps } from "./components/Dialog";

export { ToastProvider, useToast, createToastBridge } from "./components/Toast";
export type {
  ToastData,
  ToastVariant,
  ToastPlacement,
  ToastContextValue,
  ToastBridge,
  ToastProviderProps,
} from "./components/Toast";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { Checkbox } from "./components/Form/Checkbox";
export type { CheckboxProps } from "./components/Form/Checkbox";

export { Switch } from "./components/Form/Switch";
export type { SwitchProps } from "./components/Form/Switch";

export { RadioGroup, Radio, RadioButton } from "./components/Form/Radio";
export type {
  RadioGroupProps,
  RadioProps,
  RadioButtonProps,
} from "./components/Form/Radio";

export { Label } from "./components/Form/Label";
export type { LabelProps } from "./components/Form/Label";

export { Fieldset } from "./components/Form/Fieldset";
export type { FieldsetProps } from "./components/Form/Fieldset";

export { Heading, H1, H2, H3 } from "./components/Heading";
export type {
  HeadingProps,
  HeadingLevel,
  HeadingSize,
} from "./components/Heading";

export { Link } from "./components/Link";
export type { LinkProps, LinkVariant } from "./components/Link";

export { Breadcrumbs } from "./components/Breadcrumbs";
export type {
  BreadcrumbsProps,
  BreadcrumbItem,
} from "./components/Breadcrumbs";

export { ButtonLink } from "./components/Button";
export type { ButtonLinkProps } from "./components/Button";

export { ToggleButton } from "./components/ToggleButton";
export type {
  ToggleButtonProps,
  ToggleButtonVariant,
  ToggleButtonSize,
} from "./components/ToggleButton";

export {
  ToggleButtonGroup,
  ToggleButtonGroupItem,
} from "./components/ToggleButtonGroup";
export type {
  ToggleButtonGroupProps,
  ToggleButtonGroupItemProps,
  ToggleButtonGroupSize,
} from "./components/ToggleButtonGroup";

export {
  Menu,
  MenuItem,
  MenuCheckboxItem,
  MenuSection,
  MenuHeader,
  MenuSeparator,
} from "./components/Menu";
export type {
  MenuProps,
  MenuItemData,
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuSectionProps,
  MenuHeaderProps,
  MenuSeparatorProps,
} from "./components/Menu";

export { Popover, PopoverTrigger, PopoverContent } from "./components/Popover";
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
} from "./components/Popover";

export { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabsVariant,
  TabsSize,
} from "./components/Tabs";

// Raw React Aria Components tab primitives (unstyled escape hatch)
export {
  Tabs as UnstyledTabs,
  TabList as UnstyledTabList,
  Tab as UnstyledTab,
  TabPanel as UnstyledTabPanel,
} from "react-aria-components";

export {
  SegmentedControl,
  SegmentedControlItem,
} from "./components/SegmentedControl";
export type {
  SegmentedControlProps,
  SegmentedControlItemProps,
  SegmentedControlSize,
  SegmentedControlSelectionMode,
} from "./components/SegmentedControl";

export { Badge } from "./components/Badge";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./components/Badge";

export { Card } from "./components/Card";
export type { CardProps, CardPadding } from "./components/Card";

export { DeltaIndicator } from "./components/DeltaIndicator";
export type {
  DeltaIndicatorProps,
  DeltaFormat,
  DeltaMode,
} from "./components/DeltaIndicator";

export { ProgressBar } from "./components/ProgressBar";
export type {
  ProgressBarProps,
  ProgressBarVariant,
  ProgressBarSize,
} from "./components/ProgressBar";

export { Banner } from "./components/Banner";
export type { BannerProps, BannerVariant } from "./components/Banner";

export { MetricCard } from "./components/MetricCard";
export type { MetricCardProps, MetricCardSize } from "./components/MetricCard";

export { SectionHeader } from "./components/SectionHeader";
export type { SectionHeaderProps } from "./components/SectionHeader";

export { Pill, pillColorFromName, PathPill } from "./components/Pill";
export type { PillProps, PillColor, PathPillProps } from "./components/Pill";

export { FormWizard, useFormWizard } from "./components/FormWizard";
export type {
  FormWizardProps,
  FormWizardContextValue,
} from "./components/FormWizard";

export { FormWizardProgress } from "./components/FormWizard";
export type { FormWizardProgressProps } from "./components/FormWizard";

export { FormWizardNav } from "./components/FormWizard";
export type { FormWizardNavProps } from "./components/FormWizard";

// Design tokens (TypeScript constants)
export * from "./tokens/tokens";
