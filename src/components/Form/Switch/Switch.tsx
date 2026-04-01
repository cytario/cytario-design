import type React from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";

type PresetColor = "primary" | "success" | "destructive";

export interface SwitchProps
  extends Omit<AriaSwitchProps, "children" | "className"> {
  children?: React.ReactNode;
  /** Preset color name or any valid CSS color string for the track when selected */
  color?: PresetColor | (string & {});
  className?: string;
}

const trackColorMap: Record<PresetColor, string> = {
  primary: "bg-(--color-action-primary)",
  success: "bg-(--color-action-success)",
  destructive: "bg-(--color-action-danger)",
};

const presetColors = new Set<string>(Object.keys(trackColorMap));

function isPresetColor(color: string): color is PresetColor {
  return presetColors.has(color);
}

export function Switch({
  children,
  color = "primary",
  className,
  ...props
}: SwitchProps) {
  const isPreset = isPresetColor(color);

  return (
    <AriaSwitch
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
              "w-9 h-5 rounded-full transition-colors shrink-0 p-0.5",
              "group-focus-visible:ring-2 group-focus-visible:ring-(--color-border-focus) group-focus-visible:ring-offset-2",
              isSelected && isPreset
                ? trackColorMap[color]
                : !isSelected
                  ? "bg-(--color-border-strong)"
                  : "",
            ].join(" ")}
            style={
              isSelected && !isPreset
                ? { backgroundColor: color }
                : undefined
            }
          >
            <div
              className={[
                "w-4 h-4 rounded-full bg-(--color-surface-default) transition-transform shadow-sm",
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
