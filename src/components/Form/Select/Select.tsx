import type React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Text,
  type SelectProps as AriaSelectProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { type Size, sizeStyles } from "../../_shared/styles";
import { Label } from "../Label";

export interface SelectItem {
  id: string;
  name: string;
}

export interface SelectProps extends Omit<
  AriaSelectProps<SelectItem>,
  "children"
> {
  items: SelectItem[];
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  /** Controls padding and font size */
  size?: Size;
  /** Custom visual renderer for items in the dropdown and trigger.
   *  `item.name` remains the accessible label (used for typeahead and screen readers). */
  renderItem?: (item: SelectItem) => React.ReactNode;
}

export function Select({
  label,
  items,
  placeholder = "Select an option",
  description,
  errorMessage,
  size = "md",
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
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <Button
        aria-required={isRequired || undefined}
        className={twMerge(
          `
            inline-flex items-center justify-between
            w-full rounded-md
            text-left
            border outline-none transition-colors
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            cursor-pointer disabled:opacity-50 disabled:pointer-events-none
            bg-background
          `,
          sizeStyles[size],
          hasError
            ? "border-destructive-border"
            : "border-border",
        )}
      >
        <SelectValue
          className={twMerge(
            renderItem ? "min-w-0" : "truncate",
            "data-placeholder:text-muted-foreground",
          )}
        >
          {({ selectedItem, isPlaceholder }) => {
            if (isPlaceholder) return placeholder;
            const item = selectedItem as SelectItem;
            return renderItem ? renderItem(item) : (item?.name ?? placeholder);
          }}
        </SelectValue>
        <ChevronDown
          aria-hidden
          className={twMerge(
            "shrink-0 text-muted-foreground",
            size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          )}
        />
      </Button>

      {description && (
        <Text slot="description" className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}

      {hasError && (
        <Text
          slot="errorMessage"
          role="alert"
          className="text-sm text-destructive"
        >
          {errorMessage}
        </Text>
      )}

      <Popover
        className={twMerge(
          "w-(--trigger-width)",
          "rounded-md",
          "border border-border",
          "bg-background",
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
                `
                  flex items-center justify-between gap-2
                  rounded-sm
                  text-foreground
                  cursor-pointer outline-none
                  hover:bg-muted
                  focus-visible:bg-muted
                  selected:text-primary selected:font-medium
                `,
                sizeStyles[size],
              )}
            >
              {({ isSelected }) => (
                <>
                  <span className={renderItem ? "min-w-0 flex-1" : "truncate"}>
                    {renderItem ? renderItem(item) : item.name}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
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
