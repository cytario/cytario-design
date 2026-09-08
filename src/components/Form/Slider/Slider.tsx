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
 * Single-value slider. The value readout is formatted by the caller via
 * `output` — react-aria's SliderOutput/NumberFormatter would force a raw
 * number, and consumers need unit-aware text ("32 GiB").
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
      className={twMerge("w-full flex flex-col gap-2", className)}
    >
      {({ state }) => (
        <>
          <div className="flex items-center justify-between">
            {label && <Label>{label}</Label>}
            {output && (
              <span className="text-sm font-medium text-foreground">
                {output(state.values[0])}
              </span>
            )}
          </div>
          <SliderTrack className="group relative h-5 w-full cursor-pointer disabled:cursor-default">
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-border" />
            <SliderFill className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary group-disabled:opacity-50" />
            <SliderThumb className="top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-background dragging:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
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
