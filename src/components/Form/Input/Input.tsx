import type { ElementType, ReactNode } from "react";
import {
  TextField,
  Input as AriaInput,
  Text,
  type TextFieldProps,
  ColorField,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { type ButtonSize } from "../../_shared/styles";
import { Label } from "../Label";

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export interface InputProps extends Omit<
  TextFieldProps,
  "children" | "className"
> {
  as?: typeof TextField | typeof ColorField;
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string;
  type?: "text" | "email" | "password" | "number";
  size?: ButtonSize;
  prefix?: ReactNode;
  suffix?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export const sizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs h-6",
  sm: "text-sm h-7",
  md: "text-base h-8",
  lg: "text-lg h-10",
};

export function Input({
  as: FieldProp = TextField,
  label,
  placeholder,
  description,
  errorMessage,
  type = "text",
  size = "md",
  prefix,
  suffix,
  align = "left",
  isDisabled,
  isRequired,
  className,
  ...props
}: InputProps) {
  const Field: ElementType = FieldProp;

  const isInvalid = !!errorMessage;

  const borderColor = isInvalid
    ? "border-destructive-border"
    : "border-border hover:border-border";

  const radiusClass = "rounded-md";

  const inputCx = twMerge(
    `
      w-full
      bg-transparent text-foreground
      placeholder:text-muted-foreground
      outline-none border-none
    `,
    sizeStyles[size],
    alignClasses[align],
  );

  const containerCx = twMerge(
    `
      flex items-center gap-1 px-2
      border bg-background
      outline-none transition-colors
      focus-within:ring-2 
      focus-within:ring-ring 
      focus-within:border-ring
      `,
    radiusClass,
    borderColor,
    isDisabled && "opacity-50 pointer-events-none",
  );

  return (
    <Field
      {...props}
      type={type}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={twMerge("flex w-full flex-col gap-1", className)}
    >
      {/* Label */}
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <div className={containerCx}>
        {/* Prefix */}
        {prefix}

        {/* Input */}
        <AriaInput placeholder={placeholder} className={inputCx} />

        {/* Suffix */}
        {suffix}
      </div>

      {description && (
        <Text slot="description" className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}

      {isInvalid && (
        <Text
          slot="errorMessage"
          role="alert"
          className="text-sm text-destructive"
        >
          {errorMessage}
        </Text>
      )}
    </Field>
  );
}
