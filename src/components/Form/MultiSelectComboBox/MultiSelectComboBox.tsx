import { ChevronDown } from "lucide-react";
import {
  ComboBox as AriaComboBox,
  ComboBoxValue,
  Input as AriaInput,
  ListBox,
  ListBoxItem,
  Popover,
  Tag,
  TagGroup,
  TagList,
  Text,
  type ComboBoxProps as AriaComboBoxProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { type ButtonSize, sizeStyles } from "../../_shared/styles";
import { Label } from "../Label";

export interface MultiSelectComboBoxItem {
  id: string;
  name: string;
}

export interface MultiSelectComboBoxProps
  extends Omit<
    AriaComboBoxProps<MultiSelectComboBoxItem, "multiple">,
    "children" | "className" | "placeholder"
  > {
  items: MultiSelectComboBoxItem[];
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  /** Controls the input's font size; the field grows with the tags. */
  size?: ButtonSize;
  className?: string;
}

export function MultiSelectComboBox({
  label,
  items,
  placeholder = "Select…",
  description,
  errorMessage,
  size = "md",
  isDisabled,
  isRequired,
  className,
  ...props
}: MultiSelectComboBoxProps) {
  const hasError = Boolean(errorMessage);

  return (
    <AriaComboBox
      {...props}
      items={items}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={hasError}
      selectionMode="multiple"
      className={twMerge("flex flex-col gap-1", className)}
    >
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <div
        className={twMerge(
          `
            flex items-center gap-1 px-2
            border bg-background
            outline-none transition-colors
            focus-within:ring-2 focus-within:ring-ring focus-within:border-ring
            rounded-md
          `,
          hasError ? "border-destructive-border" : "border-border",
          isDisabled && "opacity-50 pointer-events-none",
        )}
      >
        <AriaInput
          placeholder={placeholder}
          className={twMerge("w-full bg-transparent text-foreground outline-none border-none", sizeStyles[size])}
        />
        <ChevronDown
          aria-hidden
          className={twMerge(
            "shrink-0 text-muted-foreground",
            size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
          )}
        />
      </div>

      <ComboBoxValue<MultiSelectComboBoxItem>>
        {({ selectedItems, state }) => (
          <TagGroup
            aria-label={label ? `${label} selected` : "Selected items"}
            onRemove={(keys) => {
              if (Array.isArray(state.value)) {
                state.setValue(state.value.filter((key) => !keys.has(key)));
              }
            }}
          >
            <TagList
              className="flex flex-wrap gap-1 data-empty:hidden"
              items={selectedItems.filter((item) => item != null)}
            >
              {(item) => <Tag textValue={item.name}>{item.name}</Tag>}
            </TagList>
          </TagGroup>
        )}
      </ComboBoxValue>

      {description && (
        <Text slot="description" className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}

      {hasError && (
        <Text slot="errorMessage" role="alert" className="text-sm text-destructive">
          {errorMessage}
        </Text>
      )}

      <Popover
        isNonModal
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
                  flex items-center gap-2 rounded-sm
                  text-foreground
                  cursor-pointer outline-none
                  hover:bg-muted focus-visible:bg-muted
                  selected:text-primary selected:font-medium
                `,
                sizeStyles[size],
              )}
            >
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
