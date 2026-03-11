import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type SelectProps as AriaSelectProps,
  type Key,
} from "react-aria-components";

export interface SelectItem {
  id: string;
  name: string;
}

export interface SelectProps
  extends Omit<AriaSelectProps<SelectItem>, "children"> {
  /** Label displayed above the trigger (always visible) */
  label: string;
  /** Options to display in the dropdown */
  items: SelectItem[];
  /** Placeholder text when no item is selected */
  placeholder?: string;
  /** Error message displayed below the trigger */
  errorMessage?: string;
  /** When true, visually hides the label (remains accessible to screen readers). Useful when Select is used inside a Field that already renders a visible label. */
  hideLabel?: boolean;
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-(--color-text-secondary)"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-(--color-action-primary)"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

export function Select({
  label,
  items,
  placeholder = "Select an option",
  errorMessage,
  hideLabel = false,
  isDisabled,
  isRequired,
  className,
  ...props
}: SelectProps) {
  const hasError = Boolean(errorMessage);

  return (
    <AriaSelect
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={hasError}
      className={["flex flex-col gap-1", className].filter(Boolean).join(" ")}
    >
      <Label
        className={[
          "text-sm font-medium text-(--color-text-primary)",
          hideLabel && "sr-only",
        ].filter(Boolean).join(" ")}
      >
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

      <Button
        className={[
          "inline-flex items-center justify-between",
          "w-full rounded-md px-4 py-2",
          "text-base text-left",
          "border outline-none transition-colors",
          hasError
            ? "border-(--color-border-danger)"
            : "border-(--color-border-default)",
          "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          "bg-(--color-surface-default)",
        ].join(" ")}
      >
        <SelectValue className="truncate data-[placeholder]:text-(--color-text-tertiary)">
          {({ selectedText }) => selectedText || placeholder}
        </SelectValue>
        <ChevronDown />
      </Button>

      {hasError && (
        <span className="text-sm text-(--color-text-danger)">
          {errorMessage}
        </span>
      )}

      <Popover
        className={[
          "w-(--trigger-width)",
          "rounded-md",
          "border border-(--color-border-default)",
          "bg-(--color-surface-default)",
          "shadow-lg",
          "overflow-auto",
          "entering:animate-in entering:fade-in entering:slide-in-from-top-1",
          "exiting:animate-out exiting:fade-out exiting:slide-out-to-top-1",
        ].join(" ")}
      >
        <ListBox className="p-1 outline-none" items={items}>
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className={[
                "flex items-center justify-between gap-2",
                "px-4 py-2 rounded-sm",
                "text-base text-(--color-text-primary)",
                "cursor-pointer outline-none",
                "hover:bg-(--color-surface-muted)",
                "focus:bg-(--color-surface-muted)",
                "selected:text-(--color-action-primary) selected:font-medium",
              ].join(" ")}
            >
              {({ isSelected }) => (
                <>
                  <span className="truncate">{item.name}</span>
                  {isSelected && <CheckIcon />}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
