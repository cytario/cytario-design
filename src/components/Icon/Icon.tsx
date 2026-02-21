import type { LucideIcon } from "lucide-react";

export interface IconProps {
  /** A Lucide icon component */
  icon: LucideIcon;
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
  /** SVG stroke width */
  strokeWidth?: number;
  /** Accessible label — when provided, the icon is treated as meaningful */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export function Icon({
  icon: LucideComponent,
  size = "md",
  strokeWidth,
  "aria-label": ariaLabel,
  className,
}: IconProps) {
  const isDecorative = !ariaLabel;

  return (
    <LucideComponent
      size={sizeMap[size]}
      strokeWidth={strokeWidth}
      role={isDecorative ? undefined : "img"}
      aria-label={ariaLabel}
      aria-hidden={isDecorative ? "true" : undefined}
      className={className}
    />
  );
}
