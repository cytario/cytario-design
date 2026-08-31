import type React from "react";
import { twMerge } from "tailwind-merge";

export interface MetricTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function MetricText({ className, ...rest }: MetricTextProps) {
  const cx = twMerge(
    "text-xs font-medium leading-none tracking-wider tabular-nums",
    className,
  );

  return <span className={cx} {...rest} />;
}
