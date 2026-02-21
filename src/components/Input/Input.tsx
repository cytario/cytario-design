import {
  TextField,
  Label,
  Input as AriaInput,
  Text,
  type TextFieldProps,
} from "react-aria-components";

export interface InputProps
  extends Omit<TextFieldProps, "children" | "className"> {
  /** Label text displayed above the input (always visible) */
  label: string;
  /** Placeholder text shown when the input is empty */
  placeholder?: string;
  /** Help text shown below the input */
  description?: string;
  /** Error message shown below the input (triggers error styling) */
  errorMessage?: string;
  /** HTML input type */
  type?: "text" | "email" | "password" | "number";
  /** Additional CSS class for the outer wrapper */
  className?: string;
}

export function Input({
  label,
  placeholder,
  description,
  errorMessage,
  type = "text",
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

      <AriaInput
        placeholder={placeholder}
        className={[
          "w-full px-4 py-2",
          "rounded-[var(--border-radius-md)]",
          "border",
          "text-[length:var(--font-size-base)]",
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
