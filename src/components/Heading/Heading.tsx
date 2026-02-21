import type React from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface HeadingProps {
  /** HTML heading element to render */
  as?: HeadingLevel;
  /** Visual size (defaults to match the `as` level) */
  size?: HeadingSize;
  children: React.ReactNode;
  className?: string;
}

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  h1: "2xl",
  h2: "xl",
  h3: "lg",
  h4: "md",
  h5: "sm",
  h6: "xs",
};

const sizeStyles: Record<HeadingSize, string> = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
  "2xl": "text-3xl",
};

export function Heading({
  as: Tag = "h2",
  size,
  className,
  children,
}: HeadingProps) {
  const resolvedSize = size ?? defaultSizeMap[Tag];

  return (
    <Tag
      className={[
        "font-semibold text-[var(--color-text-primary)]",
        sizeStyles[resolvedSize],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

/** Convenience: renders `<h1>` at 2xl size */
export function H1(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h1" size={props.size ?? "2xl"} />;
}

/** Convenience: renders `<h2>` at xl size */
export function H2(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h2" size={props.size ?? "xl"} />;
}

/** Convenience: renders `<h3>` at lg size */
export function H3(props: Omit<HeadingProps, "as">) {
  return <Heading {...props} as="h3" size={props.size ?? "lg"} />;
}
