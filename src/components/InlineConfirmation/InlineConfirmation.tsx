import { Button } from "../Button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InlineConfirmationProps {
  /** Warning message (bold) */
  message: string;
  /** Supporting description text */
  description?: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Visual variant */
  variant?: "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

/* ------------------------------------------------------------------ */
/*  Variant styles                                                     */
/* ------------------------------------------------------------------ */

const variantStyles = {
  danger: {
    container:
      "border-t border-(--color-border-danger) bg-(--color-surface-danger) -mx-6 px-6 -mb-4 pb-4 pt-4 mt-4",
    message:
      "text-sm font-semibold text-(--color-text-danger)",
    buttonDivider: "border-t border-(--color-border-danger)",
    confirmVariant: "destructive" as const,
  },
} as const;

/* ------------------------------------------------------------------ */
/*  InlineConfirmation                                                 */
/* ------------------------------------------------------------------ */

export function InlineConfirmation({
  message,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: InlineConfirmationProps) {
  const styles = variantStyles[variant];

  return (
    <div className={styles.container} role="alert">
      <p className={[styles.message, description ? "mb-1" : "mb-4"].join(" ")}>
        {message}
      </p>
      {description && (
        <p className="text-sm text-(--color-text-secondary) mb-4">
          {description}
        </p>
      )}
      <div
        className={[
          "flex items-center justify-between gap-3 pt-3",
          styles.buttonDivider,
        ].join(" ")}
      >
        <Button variant="ghost" size="md" onPress={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={styles.confirmVariant} size="md" onPress={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
