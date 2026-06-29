import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { type ButtonSize, sizeStyles } from "../../_shared/styles";
import { Icon } from "../../Icon";

export interface InputPasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  label?: string;
  description?: string;
  errorMessage?: string;
  size?: ButtonSize;
  isRequired?: boolean;
  isDisabled?: boolean;
  /** Disable only the visibility toggle; the input stays interactive. */
  isToggleDisabled?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

/**
 * Password field with a built-in show/hide visibility toggle.
 *
 * Built on a native <input> (ref-forwarded, full native attribute/event
 * passthrough) so it works equally in controlled React forms and in
 * server-driven native forms (e.g. Keycloakify login themes). The toggle
 * lives inside the input's border — no InputGroup composition required.
 */
export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    {
      label,
      description,
      errorMessage,
      size = "md",
      isRequired,
      isDisabled,
      isToggleDisabled,
      showPasswordLabel = "Show password",
      hidePasswordLabel = "Hide password",
      id,
      className,
      "aria-invalid": ariaInvalidProp,
      "aria-describedby": ariaDescribedByProp,
      ...inputProps
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const isInvalid = !!errorMessage;

    const descId = description ? `${inputId}-description` : undefined;
    const errId = isInvalid ? `${inputId}-error` : undefined;
    const describedBy =
      [descId, errId, ariaDescribedByProp].filter(Boolean).join(" ") ||
      undefined;

    const toggleDisabled = isToggleDisabled ?? isDisabled;

    return (
      <div className={twMerge("flex w-full flex-col gap-1", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {isRequired && (
              <span aria-hidden="true" className="ml-0.5 text-destructive">
                *
              </span>
            )}
          </label>
        )}

        <div
          className={twMerge(
            "flex items-center overflow-hidden rounded-md border bg-background",
            "outline-none transition-colors",
            isInvalid ? "border-destructive-border" : "border-border",
            "focus-within:ring-2 focus-within:ring-ring focus-within:border-ring",
            isDisabled && "opacity-50 pointer-events-none",
          )}
        >
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            required={isRequired}
            disabled={isDisabled}
            aria-invalid={isInvalid || ariaInvalidProp}
            aria-describedby={describedBy}
            className={twMerge(
              "w-full bg-transparent text-foreground",
              "placeholder:text-muted-foreground",
              "outline-none border-none",
              sizeStyles[size],
            )}
          />
          <button
            type="button"
            aria-label={visible ? hidePasswordLabel : showPasswordLabel}
            disabled={toggleDisabled}
            tabIndex={toggleDisabled ? -1 : undefined}
            onClick={() => setVisible((v) => !v)}
            className={twMerge(
              "flex items-center justify-center shrink-0 self-stretch px-3 cursor-pointer",
              "text-muted-foreground hover:text-foreground transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Icon icon={visible ? EyeOff : Eye} size="sm" />
          </button>
        </div>

        {description && (
          <p id={descId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {isInvalid && (
          <p id={errId} role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
