import type React from "react";
import {
  RadioGroup as AriaRadioGroup,
  Radio as AriaRadio,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";

export interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, "children" | "className"> {
  children: React.ReactNode;
  className?: string;
}

export interface RadioProps
  extends Omit<AriaRadioProps, "children" | "className"> {
  children?: React.ReactNode;
  className?: string;
}

export interface RadioButtonProps
  extends Omit<AriaRadioProps, "children" | "className"> {
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({ children, className, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      className={[
        "flex flex-col gap-2",
        "disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </AriaRadioGroup>
  );
}

export function Radio({ children, className, ...props }: RadioProps) {
  return (
    <AriaRadio
      {...props}
      className={[
        "group flex items-center gap-2 text-sm text-(--color-text-primary) cursor-pointer",
        "disabled:opacity-50 disabled:cursor-default",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {({ isSelected }) => (
        <>
          <div
            className={[
              "flex items-center justify-center w-5 h-5 shrink-0",
              "rounded-full border-2 transition-colors",
              "group-focus-visible:ring-2 group-focus-visible:ring-(--color-border-focus) group-focus-visible:ring-offset-2",
              isSelected
                ? "border-(--color-action-primary)"
                : "border-(--color-border-default) group-hover:border-(--color-border-strong)",
            ].join(" ")}
          >
            {isSelected && (
              <div className="w-2.5 h-2.5 rounded-full bg-(--color-action-primary)" />
            )}
          </div>
          {children && <span>{children}</span>}
        </>
      )}
    </AriaRadio>
  );
}

export function RadioButton({ children, className, ...props }: RadioButtonProps) {
  return (
    <AriaRadio
      {...props}
      className={[
        "group cursor-pointer",
        "disabled:opacity-50 disabled:cursor-default",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {({ isSelected }) => (
        <div
          className={[
            "px-4 py-2 text-sm font-medium",
            "rounded-md border transition-colors text-center",
            "group-focus-visible:ring-2 group-focus-visible:ring-(--color-border-focus) group-focus-visible:ring-offset-2",
            isSelected
              ? "bg-(--color-action-primary) border-(--color-action-primary) text-(--color-text-inverse)"
              : "bg-(--color-surface-default) border-(--color-border-default) text-(--color-text-primary) hover:border-(--color-border-strong)",
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </AriaRadio>
  );
}
