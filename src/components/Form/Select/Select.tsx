import type React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type SelectProps as AriaSelectProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface SelectItem {
  id: string;
  name: string;
}

export interface SelectProps
  extends Omit<AriaSelectProps<SelectItem>, "children"> {
  items: SelectItem[];
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  renderItem?: (item: SelectItem) => React.ReactNode;
}

export function Select({
  label,
  items,
  placeholder = "Select an option",
  errorMessage,
  isDisabled,
  isRequired,
  className,
  renderItem,
  ...props
}: SelectProps) {
  const hasError = Boolean(errorMessage);

  return (
    <AriaSelect
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={hasError}
      className={twMerge("flex flex-col gap-1", className as string)}
    >
      {label && (
        <Label className="text-sm font-medium text-(--color-text-primary)">
          {label}
          {isRequired && (
            <span
              aria-hidden="true"
              className="ml-0.5 text-(--color-text-danger)"
            >
              *
            </span>
          )}
        </Label>
      )}

      <Button
        className={twMerge(
          "inline-flex items-center justify-between",
          "w-full rounded-md px-4 py-2",
          "text-base text-left",
          "border outline-none transition-colors",
          hasError ? "border-(--color-border-danger)" : "border-(--color-border-default)",
          "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2",
          "cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
          "bg-(--color-surface-default)",
        )}
      >
        <SelectValue
          className={twMerge(
            renderItem ? "min-w-0" : "truncate",
            "data-placeholder:text-(--color-text-tertiary)",
          )}
        >
          {({ selectedItem, isPlaceholder }) => {
            if (isPlaceholder) return placeholder;
            const item = selectedItem as SelectItem;
            return renderItem ? renderItem(item) : item?.name ?? placeholder;
          }}
        </SelectValue>
        <ChevronDown
          aria-hidden
          className="h-4 w-4 shrink-0 text-(--color-text-secondary)"
        />
      </Button>

      {hasError && (
        <span className="text-sm text-(--color-text-danger)">
          {errorMessage}
        </span>
      )}

      <Popover
        className={twMerge(
          "w-(--trigger-width)",
          "rounded-md",
          "border border-(--color-border-default)",
          "bg-(--color-surface-default)",
          "shadow-lg",
          "overflow-auto",
          "entering:animate-in entering:fade-in",
          "exiting:animate-out exiting:fade-out",
        )}
      >
        <ListBox className="p-1 outline-none" items={items}>
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className={twMerge(
                "flex items-center justify-between gap-2",
                "px-4 py-2 rounded-sm",
                "text-base text-(--color-text-primary)",
                "cursor-pointer outline-none",
                "hover:bg-(--color-surface-muted)",
                "focus-visible:bg-(--color-surface-muted)",
                "selected:text-(--color-action-primary) selected:font-medium",
              )}
            >
              {({ isSelected }) => (
                <>
                  <span className="truncate">
                    {renderItem ? renderItem(item) : item.name}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-(--color-action-primary)" />
                  )}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
