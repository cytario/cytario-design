import {
  TextField,
  Label,
  Input as AriaInput,
  Text,
  type TextFieldProps,
} from "react-aria-components";
import { type Size, sizeStyles } from "../../_shared/styles";
import { useInputGroup } from "../InputGroup/InputGroupContext";

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export interface InputProps extends Omit<
  TextFieldProps,
  "children" | "className"
> {
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
  size?: Size;
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
      return "rounded-l-(--border-radius-md) rounded-r-none";
    case "middle":
      return "rounded-none";
    case "end":
      return "rounded-r-(--border-radius-md) rounded-l-none";
    default:
      return "rounded-md";
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
    ? "border-(--color-border-danger)"
    : "border-(--color-border-default) hover:border-(--color-border-strong)";

  const radiusClass = inGroup ? groupRadiusClasses(position) : "rounded-md";

  /** When not first in a group, overlap left border with previous sibling */
  const marginClass =
    inGroup && position !== "start" && position !== "standalone"
      ? "-ml-px"
      : "";

  return (
    <TextField
      {...props}
      type={type}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={[
        "flex flex-col gap-1",
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
            "text-sm",
            "font-medium",
            "text-(--color-text-primary)",
          ].join(" ")}
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
      )}

      {prefix ? (
        <div
          className={[
            "flex items-center overflow-hidden",
            radiusClass,
            "border",
            "bg-(--color-surface-default)",
            "outline-none transition-colors",
            borderColor,
            "focus-within:ring-2 focus-within:ring-(--color-border-focus) focus-within:border-(--color-border-focus)",
            inGroup ? "focus-within:z-10" : "",
            isDisabled ? "opacity-50 pointer-events-none" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            className={[
              "self-stretch flex items-center shrink-0 select-none",
              "bg-(--color-surface-subtle)",
              "border-r border-r-(--color-border-default)",
              "text-(--color-text-secondary)",
              sizeStyles[size],
            ].join(" ")}
          >
            {prefix}
          </span>
          <AriaInput
            placeholder={placeholder}
            className={[
              "w-full bg-transparent",
              sizeStyles[size],
              alignClasses[align],
              "text-(--color-text-primary)",
              "placeholder:text-(--color-text-tertiary)",
              "outline-none border-none",
            ].join(" ")}
          />
        </div>
      ) : (
        <AriaInput
          placeholder={placeholder}
          className={[
            "w-full",
            sizeStyles[size],
            alignClasses[align],
            radiusClass,
            "border",
            "text-(--color-text-primary)",
            "bg-(--color-surface-default)",
            "placeholder:text-(--color-text-tertiary)",
            "outline-none transition-colors",
            borderColor,
            "focus:ring-2 focus:ring-(--color-border-focus) focus:border-(--color-border-focus)",
            inGroup ? "focus:z-10" : "",
            "disabled:opacity-50 disabled:pointer-events-none",
          ].join(" ")}
        />
      )}

      {description && !isInvalid && (
        <Text
          slot="description"
          className="text-sm text-(--color-text-secondary)"
        >
          {description}
        </Text>
      )}

      {isInvalid && (
        <Text
          slot="errorMessage"
          className="text-sm text-(--color-text-danger)"
        >
          {errorMessage}
        </Text>
      )}
    </TextField>
  );
}
