import {
  TextField,
  Label,
  Input as AriaInput,
  Text,
  type TextFieldProps,
} from "react-aria-components";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-4 py-3 text-lg",
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

  return (
    <TextField
      {...props}
      type={type}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={["flex flex-col gap-[var(--spacing-1)]", className]
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
            "flex items-center",
            "rounded-[var(--border-radius-md)]",
            "border",
            "bg-[var(--color-surface-default)]",
            "outline-none transition-colors",
            isInvalid
              ? "border-[var(--color-border-danger)]"
              : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]",
            "focus-within:ring-2 focus-within:ring-[var(--color-border-focus)] focus-within:border-[var(--color-border-focus)]",
            isDisabled ? "opacity-50 pointer-events-none" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span
            className={[
              "shrink-0 select-none",
              "text-[var(--color-text-secondary)]",
              size === "sm" ? "pl-3 text-sm" : size === "lg" ? "pl-4 text-lg" : "pl-4 text-base",
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
              "pl-1.5",
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
            "rounded-[var(--border-radius-md)]",
            "border",
            "text-[var(--color-text-primary)]",
            "bg-[var(--color-surface-default)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "outline-none transition-colors",
            isInvalid
              ? "border-[var(--color-border-danger)]"
              : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]",
            "focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-border-focus)]",
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
