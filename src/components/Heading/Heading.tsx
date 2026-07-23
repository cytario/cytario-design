import { forwardRef } from "react";
import type React from "react";
import { twMerge } from "tailwind-merge";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";
export type HeadingWeight = "medium" | "semibold" | "bold";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading element to render */
  as?: HeadingLevel;
  /** Visual size (defaults to match the `as` level) */
  size?: HeadingSize;
  /** Font weight (defaults to "semibold") */
  weight?: HeadingWeight;
  children: React.ReactNode;
}

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  h1: "5xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "sm",
};

const sizeStyles: Record<HeadingSize, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
  "3xl": "text-4xl",
  "4xl": "text-5xl",
  "5xl": "text-6xl",
};

const weightStyles: Record<HeadingWeight, string> = {
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { as: Tag = "h2", size, weight = "semibold", className, children, ...rest },
    ref,
  ) {
    const resolvedSize = size ?? defaultSizeMap[Tag];

    return (
      <Tag
        ref={ref}
        className={twMerge(
          weightStyles[weight],
          "text-foreground",
          sizeStyles[resolvedSize],
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

/** Convenience: renders `<h1>` at 5xl size (60px) with bold weight */
export function H1(props: Omit<HeadingProps, "as">) {
  return (
    <Heading
      {...props}
      as="h1"
      size={props.size ?? "5xl"}
      weight={props.weight ?? "bold"}
    />
  );
}

/** Convenience: renders `<h2>` at 3xl size (36px) with bold weight */
export function H2(props: Omit<HeadingProps, "as">) {
  return (
    <Heading {...props} as="h2" size={props.size ?? "3xl"} weight={props.weight ?? "bold"} />
  );
}

/** Convenience: renders `<h3>` at 2xl size (30px) with bold weight */
export function H3(props: Omit<HeadingProps, "as">) {
  return (
    <Heading {...props} as="h3" size={props.size ?? "2xl"} weight={props.weight ?? "bold"} />
  );
}

/** Convenience: renders `<h4>` at xl size (24px) */
export function H4(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h4" size={props.size ?? "xl"} />;
}

/** Convenience: renders `<h5>` at lg size (20px) */
export function H5(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h5" size={props.size ?? "lg"} />;
}

/** Convenience: renders `<h6>` at sm size (16px) */
export function H6(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h6" size={props.size ?? "sm"} />;
}
