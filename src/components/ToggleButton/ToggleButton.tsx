import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { type ButtonSize, sizeStyles } from "../_shared/styles";

export type ToggleButtonVariant = "default" | "primary" | "outlined";
export type ToggleButtonSize = ButtonSize;

export interface ToggleButtonProps extends Omit<
  AriaToggleButtonProps,
  "className"
> {
  /** Visual style variant */
  variant?: ToggleButtonVariant;
  /** Size preset */
  size?: ToggleButtonSize;
  /** Use fixed square dimensions instead of padding-based sizing */
  isSquare?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles: Record<ToggleButtonSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-7 w-7 text-sm",
  md: "h-8 w-8 text-base",
  lg: "h-10 w-10 text-lg",
};

const variantStyles: Record<
  ToggleButtonVariant,
  { base: string; selected: string }
> = {
  default: {
    base: [
      "bg-transparent text-foreground",
      "hover:bg-accent",
      "pressed:bg-accent",
    ].join(" "),
    selected: "bg-accent text-foreground",
  },
  primary: {
    base: [
      "bg-transparent text-foreground",
      "hover:bg-accent",
      "pressed:bg-accent",
    ].join(" "),
    selected: "bg-primary-pressed text-primary-foreground",
  },
  outlined: {
    base: [
      "bg-background text-foreground",
      "border border-border",
      "hover:bg-card",
      "pressed:bg-muted",
    ].join(" "),
    selected: [
      "bg-slate-800 text-primary-foreground",
      "border border-slate-800",
    ].join(" "),
  },
};

export function ToggleButton({
  variant = "default",
  size = "md",
  isSquare = false,
  className,
  ...props
}: ToggleButtonProps) {
  const styles = variantStyles[variant];

  return (
    <AriaToggleButton
      {...props}
      className={({ isSelected }) =>
        twMerge(
          "inline-flex items-center justify-center gap-2 cursor-pointer",
          isSquare ? "rounded-none" : "rounded-md",
          "font-medium",
          "leading-tight",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          isSquare ? squareSizeStyles[size] : sizeStyles[size],
          isSelected ? styles.selected : styles.base,
          className,
        )
      }
    />
  );
}
