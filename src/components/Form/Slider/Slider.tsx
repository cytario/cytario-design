import type React from "react";
import {
  Slider as AriaSlider,
  SliderTrack,
  SliderFill,
  SliderThumb,
  type SliderProps as AriaSliderProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { Label } from "../Label";

export interface SliderProps
  extends Omit<AriaSliderProps, "children" | "className"> {
  /** Label text above the slider. */
  label?: string;
  /** Formats the current value for the right-aligned readout. */
  output?: (value: number) => string;
  /** Description text below the track (e.g. min / max bounds). */
  description?: string;
  /** Error text below the track. */
  errorMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Single-value slider. Layout follows the react-aria styling guide: the track
 * is the pointer hit area, a slim rail inside it carries the fill, and the
 * thumb relies on RAC's inline `transform: translate(-50%, -50%)` for
 * centering — no Tailwind translate on the thumb (they would stack).
 */
export function Slider({
  label,
  output,
  description,
  errorMessage,
  children,
  className,
  isDisabled,
  ...props
}: SliderProps) {
  return (
    <AriaSlider
      {...props}
      isDisabled={isDisabled}
      className={twMerge(
        // data-disabled lands on the root (tailwindcss-react-aria-components
        // maps the disabled: variant onto it).
        "w-full flex flex-col gap-2 disabled:opacity-50 disabled:cursor-default",
        className,
      )}
    >
      {({ state }) => (
        <>
          <div className="flex items-center justify-between">
            {label && <Label>{label}</Label>}
            {output && (
              <span className="text-sm font-medium text-foreground tabular-nums">
                {output(state.values[0])}
              </span>
            )}
          </div>
          {/* Track: 24px hit area; the 6px rail inside is the visible bar.
              RAC gives the fill `height: 100%` of its positioned ancestor, so
              the rail (not the padded track) must be the fill's parent. */}
          <SliderTrack className="flex h-6 w-full cursor-pointer items-center">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border">
              <SliderFill className="h-full rounded-full bg-primary" />
            </div>
            <SliderThumb
              className={twMerge(
                "top-1/2 h-4 w-4 rounded-full bg-background",
                "border-2 border-primary",
                "shadow-sm",
                "transition-[box-shadow,border-color]",
                "hovered:border-primary-hover",
                "dragging:cursor-grabbing",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
            />
          </SliderTrack>
          {(description || errorMessage) && (
            <p
              className={twMerge(
                "text-xs text-muted-foreground",
                errorMessage && "text-destructive",
              )}
            >
              {errorMessage ?? description}
            </p>
          )}
          {children}
        </>
      )}
    </AriaSlider>
  );
}
