import { forwardRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type TextVariant =
  | "body"
  | "small"
  | "muted"
  | "caption"
  | "eyebrow"
  | "eyebrow-bold";

export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface TextProps
  extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  /** HTML element to render (default "p") */
  as?: ElementType;
  /** Visual variant (default "body") */
  variant?: TextVariant;
  /** Font weight override */
  weight?: TextWeight;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  body: "text-base text-foreground",
  small: "text-sm text-foreground",
  muted: "text-sm text-muted-foreground",
  caption: "text-xs text-muted-foreground",
  eyebrow: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
  "eyebrow-bold":
    "text-xs font-bold uppercase tracking-wider text-foreground",
};

const weightStyles: Record<TextWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as: Tag = "p", variant = "body", weight, className, children, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={twMerge(
        variantStyles[variant],
        weight && weightStyles[weight],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
