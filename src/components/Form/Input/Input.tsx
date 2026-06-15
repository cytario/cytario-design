import type { ElementType } from "react";
import {
  TextField,
  Input as AriaInput,
  Text,
  type TextFieldProps,
  ColorField,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { type Size, sizeStyles } from "../../_shared/styles";
import { useInputGroup } from "../InputGroup/InputGroupContext";
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
  size?: Size;
  prefix?: string;
  align?: "left" | "center" | "right";
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
  as: FieldProp = TextField,
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
  const Field: ElementType = FieldProp;

  const isInvalid = !!errorMessage;
  const { inGroup, position } = useInputGroup();

  const borderColor = isInvalid
    ? "border-destructive-border"
    : "border-border hover:border-border";

  const radiusClass = inGroup ? groupRadiusClasses(position) : "rounded-md";

  /** When not first in a group, overlap left border with previous sibling */
  const marginClass =
    inGroup && position !== "start" && position !== "standalone"
      ? "-ml-px"
      : "";

  return (
    <Field
      {...props}
      type={type}
      isDisabled={isDisabled}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={twMerge(
        "flex w-full flex-col gap-1",
        inGroup ? "min-w-0 flex-1" : "",
        marginClass,
        className,
      )}
    >
      {label && <Label isRequired={isRequired}>{label}</Label>}

      {prefix ? (
        <div
          className={twMerge(
            "flex items-center overflow-hidden",
            radiusClass,
            "border",
            "bg-background",
            "outline-none transition-colors",
            borderColor,
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
            inGroup && "focus-within:z-10",
            isDisabled && "opacity-50 pointer-events-none",
          )}
        >
          <span
            className={twMerge(
              "self-stretch flex items-center shrink-0 select-none",
              "bg-card",
              "border-r border-r-border",
              "text-muted-foreground",
              sizeStyles[size],
            )}
          >
            {prefix}
          </span>
          <AriaInput
            placeholder={placeholder}
            className={twMerge(
              "w-full bg-transparent",
              sizeStyles[size],
              alignClasses[align],
              "text-foreground",
              "placeholder:text-muted-foreground",
              "outline-none border-none",
            )}
          />
        </div>
      ) : (
        <AriaInput
          placeholder={placeholder}
          className={twMerge(
            "w-full",
            sizeStyles[size],
            alignClasses[align],
            radiusClass,
            "border",
            "text-foreground",
            "bg-background",
            "placeholder:text-muted-foreground",
            "outline-none transition-colors",
            borderColor,
            "focus:ring-2 focus:ring-ring focus:border-ring",
            inGroup && "focus:z-10",
            "disabled:opacity-50 disabled:pointer-events-none",
          )}
        />
      )}

      {description && (
        <Text
          slot="description"
          className="text-sm text-muted-foreground"
        >
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
