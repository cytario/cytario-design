import type React from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";

export interface SwitchProps
  extends Omit<AriaSwitchProps, "children" | "className"> {
  children?: React.ReactNode;
  color?: "primary" | "success" | "destructive";
  className?: string;
}

const trackColorMap = {
  primary: "bg-[var(--color-action-primary)]",
  success: "bg-[var(--color-action-success)]",
  destructive: "bg-[var(--color-action-danger)]",
} as const;

export function Switch({
  children,
  color = "primary",
  className,
  ...props
}: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className={[
        "group flex items-center gap-2 text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] cursor-pointer",
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
              "w-9 h-5 rounded-full transition-colors shrink-0 p-0.5",
              "group-focus-visible:ring-2 group-focus-visible:ring-[var(--color-border-focus)] group-focus-visible:ring-offset-2",
              isSelected
                ? trackColorMap[color]
                : "bg-[var(--color-border-strong)]",
            ].join(" ")}
          >
            <div
              className={[
                "w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                isSelected ? "translate-x-4" : "translate-x-0",
              ].join(" ")}
            />
          </div>
          {children && <span>{children}</span>}
        </>
      )}
    </AriaSwitch>
  );
}
