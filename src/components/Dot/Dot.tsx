import { forwardRef, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type DotColor =
  | "accent"
  | "primary"
  | "neutral"
  | "success"
  | "warning"
  | "destructive"
  | "info";

export type DotSize = "sm" | "md" | "lg";

export interface DotProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  color?: DotColor;
  size?: DotSize;
  /** Expanding box-shadow ripple around the dot, in the dot's own fill color. */
  pulse?: boolean;
}

/* text- mirrors bg- so the pulse ripple (currentColor) matches the fill in both themes. */
const colorStyles: Record<DotColor, string> = {
  accent: "bg-ring text-ring",
  primary: "bg-primary text-primary",
  neutral: "bg-muted-foreground text-muted-foreground",
  success: "bg-success text-success",
  warning: "bg-warning text-warning",
  destructive: "bg-destructive text-destructive",
  info: "bg-info text-info",
};

const sizeStyles: Record<DotSize, string> = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

export const Dot = forwardRef<HTMLSpanElement, DotProps>(function Dot(
  { color = "neutral", size = "md", pulse, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={twMerge(
        "inline-block shrink-0 rounded-full transition-colors",
        colorStyles[color],
        sizeStyles[size],
        pulse && "animate-dot-pulse",
        className,
      )}
      {...rest}
    />
  );
});
