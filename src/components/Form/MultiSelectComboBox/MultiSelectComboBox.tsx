import { Check, ChevronDown, X } from "lucide-react";
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  ComboBoxValue,
  Group,
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

import { PathPill } from "../../PathPill";
import { type ButtonSize, sizeStyles } from "../../_shared/styles";
import { Label } from "../Label";

export interface MultiSelectComboBoxItem {
  id: string;
  name: string;
}

export interface MultiSelectComboBoxProps extends Omit<
  AriaComboBoxProps<MultiSelectComboBoxItem, "multiple">,
  "children" | "className" | "placeholder"
> {
  items: MultiSelectComboBoxItem[];
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  /** Controls the input's padding and font size */
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
      defaultItems={items}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={hasError}
      selectionMode="multiple"
      className={twMerge("flex flex-col gap-1", className)}
    >
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <Group
        className="
          flex items-center gap-1 px-2
          border border-border bg-background
          outline-none transition-colors
          focus-within:ring-2 focus-within:ring-ring focus-within:border-ring
          invalid:border-destructive-border
          disabled:opacity-50 disabled:pointer-events-none
          rounded-md
        "
      >
        <AriaInput
          placeholder={placeholder}
          className={twMerge(
            "w-full bg-transparent text-foreground outline-none border-none",
            sizeStyles[size],
          )}
        />
        <AriaButton className="shrink-0 cursor-pointer rounded-sm text-muted-foreground outline-none">
          <ChevronDown
            aria-hidden
            className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
          />
        </AriaButton>
      </Group>

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
              {(item) => (
                <Tag
                  textValue={item.name}
                  className="flex items-center gap-0.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <PathPill>{item.name}</PathPill>
                  <AriaButton
                    slot="remove"
                    className="flex cursor-pointer items-center rounded-full p-0.5 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X aria-hidden className="h-3 w-3" />
                  </AriaButton>
                </Tag>
              )}
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
        <Text
          slot="errorMessage"
          role="alert"
          className="text-sm text-destructive"
        >
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
        <ListBox<MultiSelectComboBoxItem> className="p-1 outline-none">
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className={twMerge(
                `
                  flex items-center justify-between gap-2 rounded-sm
                  text-foreground
                  cursor-pointer outline-none
                  hover:bg-muted focus-visible:bg-muted
                  selected:text-primary selected:font-medium
                `,
                sizeStyles[size],
              )}
            >
              {({ isSelected }) => (
                <>
                  <span className="truncate">{item.name}</span>
                  {isSelected && (
                    <Check
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-primary"
                    />
                  )}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
