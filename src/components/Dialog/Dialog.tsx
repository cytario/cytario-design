import type React from "react";
import {
  Modal,
  ModalOverlay,
  Dialog as AriaDialog,
  Heading,
  type DialogProps as AriaDialogProps,
} from "react-aria-components";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether clicking outside the dialog dismisses it. Defaults to true. */
  isDismissable?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  size = "md",
  isDismissable = true,
  children,
  className,
}: DialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={[
        "fixed inset-0 z-50 bg-[var(--color-overlay-backdrop)] backdrop-blur-sm",
        "flex items-center justify-center",
        "data-[entering]:animate-in data-[entering]:fade-in",
        "data-[exiting]:animate-out data-[exiting]:fade-out",
      ].join(" ")}
    >
      <Modal
        className={[
          "w-full mx-4",
          sizeStyles[size],
          "bg-[var(--color-surface-default)] rounded-lg shadow-xl max-h-[85vh] flex flex-col",
          "data-[entering]:animate-in data-[entering]:zoom-in-95 data-[entering]:fade-in",
          "data-[exiting]:animate-out data-[exiting]:zoom-out-95 data-[exiting]:fade-out",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <AriaDialog className="outline-none flex flex-col max-h-[85vh]">
          {({ close }) => (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-default)]">
                <Heading
                  slot="title"
                  className="text-lg font-semibold text-[var(--color-text-primary)]"
                >
                  {title}
                </Heading>
                <button
                  type="button"
                  onClick={close}
                  className={[
                    "inline-flex items-center justify-center rounded-md p-1",
                    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]",
                    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2",
                    "transition-colors",
                  ].join(" ")}
                  aria-label="Close"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto">{children}</div>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
