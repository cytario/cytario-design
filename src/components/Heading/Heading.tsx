import { forwardRef } from "react";
import type React from "react";
import { twMerge } from "tailwind-merge";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = HeadingLevel | "hero";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: React.ReactNode;
}

const sizeMap = {
  h1: "text-4xl sm:text-5xl leading-tight font-bold",
  h2: "text-2xl sm:text-3xl leading-tight font-bold",
  h3: "text-lg sm:text-xl leading-snug font-bold",
  h4: "text-base sm:text-lg font-semibold",
  h5: "text-sm sm:text-base font-semibold",
  h6: "text-sm font-semibold",
  hero: "text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    { as: Tag = "h2", size, className, children, ...rest },
    ref,
  ) {
    const resolvedSize = size ?? Tag;
    const cx = twMerge("text-inherit mb-4", sizeMap[resolvedSize], className);

    return (
      <Tag ref={ref} className={cx} {...rest}>
        {children}
      </Tag>
    );
  },
);

/** Convenience: renders `<h1>` with h1 styles (4xl→5xl responsive, bold) */
export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H1(props, ref) {
    return <Heading {...props} ref={ref} as="h1" />;
  },
);

/** Convenience: renders `<h2>` with h2 styles (2xl→3xl responsive, bold) */
export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H2(props, ref) {
    return <Heading {...props} ref={ref} as="h2" />;
  },
);

/** Convenience: renders `<h3>` with h3 styles (lg→xl responsive, bold) */
export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H3(props, ref) {
    return <Heading {...props} ref={ref} as="h3" />;
  },
);

/** Convenience: renders `<h4>` with h4 styles (base→lg responsive, semibold) */
export const H4 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H4(props, ref) {
    return <Heading {...props} ref={ref} as="h4" />;
  },
);

/** Convenience: renders `<h5>` with h5 styles (sm→base responsive, semibold) */
export const H5 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H5(props, ref) {
    return <Heading {...props} ref={ref} as="h5" />;
  },
);

/** Convenience: renders `<h6>` with h6 styles (sm, semibold) */
export const H6 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  function H6(props, ref) {
    return <Heading {...props} ref={ref} as="h6" />;
  },
);
