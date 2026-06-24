import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { iconRegistry, type IconName } from "./icon-registry";

export type { IconName };

/** Any Lucide-compatible icon component — a Lucide icon or a custom SVG. */
export type IconComponent = ComponentType<LucideProps>;

/** A registered icon name, or an icon component passed directly. */
export type IconValue = IconName | IconComponent;

export interface IconProps {
  icon: IconValue;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  strokeWidth?: number;
  className?: string;
}

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

/** An icon rendered at one of the design system's preset sizes. */
export function Icon({ icon, size = "md", strokeWidth = 2, className }: IconProps) {
  const Component: IconComponent =
    typeof icon === "string" ? iconRegistry[icon] : icon;

  return (
    <Component
      size={sizeMap[size]}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable={false}
      className={twMerge("shrink-0", className)}
    />
  );
}
