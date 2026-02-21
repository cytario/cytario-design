import type React from "react";
import { Label } from "../Label";

export interface FieldProps {
  label?: string;
  isRequired?: boolean;
  description?: string;
  error?: string | { message?: string };
  children: React.ReactNode;
  className?: string;
}

function getErrorMessage(error: FieldProps["error"]): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  return error.message;
}

export function Field({
  label,
  isRequired,
  description,
  error,
  children,
  className,
}: FieldProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div
      className={["flex flex-col gap-[var(--spacing-1)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label && <Label isRequired={isRequired}>{label}</Label>}
      {children}
      {description && !errorMessage && (
        <p className="text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
      {errorMessage && (
        <p className="text-[length:var(--font-size-sm)] text-[var(--color-text-danger)]">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
