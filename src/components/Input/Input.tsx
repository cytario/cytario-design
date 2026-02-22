import {
  TextField,
  Label,
  Input as AriaInput,
  Text,
  type TextFieldProps,
} from "react-aria-components";
import { useInputGroup } from "../InputGroup/InputGroupContext";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
} as const;

const prefixSizeClasses = {
  sm: "px-3 text-sm",
  md: "px-3 text-base",
  lg: "px-4 text-lg",
} as const;

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export interface InputProps
  extends Omit<TextFieldProps, "children" | "className"> {
  /** Label text displayed above the input. Omit for raw input mode. */
  label?: string;
  /** Placeholder text shown when the input is empty */
  placeholder?: string;
  /** Help text shown below the input */
  description?: string;
  /** Error message shown below the input (triggers error styling) */
  errorMessage?: string;
  /** HTML input type */
  type?: "text" | "email" | "password" | "number";
  /** Controls padding and font size */
  size?: "sm" | "md" | "lg";
  /** Text prefix shown inside the input on the left (e.g., "$", "https://") */
  prefix?: string;
  /** Text alignment within the input */
  align?: "left" | "center" | "right";
  /** Additional CSS class for the outer wrapper */
  className?: string;
}

/**
 * Returns Tailwind border-radius classes for the border-bearing element
 * based on InputGroup position context.
 */
function groupRadiusClasses(
  position: "start" | "middle" | "end" | "standalone",
): string {
  switch (position) {
    case "start":
      return "rounded-l-[var(--border-radius-md)] rounded-r-none";
    case "middle":
      return "rounded-none";
    case "end":
      return "rounded-r-[var(--border-radius-md)] rounded-l-none";
    default:
      return "rounded-[var(--border-radius-md)]";
  }
}

export function Input({
  label,
  placeholder,
  description,
  errorMessage,
  type = "text",
  size = "md",
  prefix,
  align = "left",
  isDisabled,
  isRequired,
  className,
  ...props
}: InputProps) {
  const isInvalid = !!errorMessage;
  const { inGroup, position } = useInputGroup();

  const borderColor = isInvalid
    ? "border-[var(--color-border-danger)]"
    : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]";

  const radiusClass = inGroup
    ? groupRadiusClasses(position)
    : "rounded-[var(--border-radius-md)]";

  /** When not first in a group, overlap left border with previous sibling */
  const marginClass = inGroup && position !== "start" && position !== "standalone" ? "-ml-px" : "";

  return (
    <TextField
      {...props}
      type={type}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={[
        "flex flex-col gap-[var(--spacing-1)]",
        inGroup ? "min-w-0 flex-1" : "",
        marginClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <Label
          className={[
            "text-[length:var(--font-size-sm)]",
            "font-[number:var(--font-weight-medium)]",
            "text-[var(--color-text-primary)]",
          ].join(" ")}
        >
          {label}
          {isRequired && (
            <span
              aria-hidden="true"
              className="ml-0.5 text-[var(--color-text-danger)]"
            >
              *
            </span>
          )}
        </Label>
      )}

      {prefix ? (
        <div
          className={[
            "flex items-center overflow-hidden",
            radiusClass,
            "border",
            "bg-[var(--color-surface-default)]",
            "outline-none transition-colors",
            borderColor,
            "focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:border-[var(--color-border-focus)]",
            inGroup ? "focus-within:z-10" : "",
            isDisabled ? "opacity-50 pointer-events-none" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            className={[
              "self-stretch flex items-center shrink-0 select-none",
              "bg-[var(--color-surface-subtle)]",
              "border-r border-r-[var(--color-border-default)]",
              "text-[var(--color-text-secondary)]",
              prefixSizeClasses[size],
            ].join(" ")}
          >
            {prefix}
          </span>
          <AriaInput
            placeholder={placeholder}
            className={[
              "w-full bg-transparent",
              sizeClasses[size],
              alignClasses[align],
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-tertiary)]",
              "outline-none border-none",
            ].join(" ")}
          />
        </div>
      ) : (
        <AriaInput
          placeholder={placeholder}
          className={[
            "w-full",
            sizeClasses[size],
            alignClasses[align],
            radiusClass,
            "border",
            "text-[var(--color-text-primary)]",
            "bg-[var(--color-surface-default)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "outline-none transition-colors",
            borderColor,
            "focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)]",
            inGroup ? "focus:z-10" : "",
            "disabled:opacity-50 disabled:pointer-events-none",
          ].join(" ")}
        />
      )}

      {description && !isInvalid && (
        <Text
          slot="description"
          className="text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]"
        >
          {description}
        </Text>
      )}

      {isInvalid && (
        <Text
          slot="errorMessage"
          className="text-[length:var(--font-size-sm)] text-[var(--color-text-danger)]"
        >
          {errorMessage}
        </Text>
      )}
    </TextField>
  );
}
