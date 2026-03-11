import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";

export type LinkVariant = "default" | "subtle";

export interface LinkProps extends Omit<AriaLinkProps, "className"> {
  /** Visual style variant */
  variant?: LinkVariant;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<LinkVariant, string> = {
  default: [
    "text-teal-700 underline",
    "hover:text-teal-800",
  ].join(" "),
  subtle: [
    "text-(--color-text-secondary) no-underline",
    "hover:underline hover:text-(--color-text-primary)",
  ].join(" "),
};

export function Link({
  variant = "default",
  className,
  ...props
}: LinkProps) {
  return (
    <AriaLink
      {...props}
      className={[
        "outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-2 focus-visible:rounded-sm",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
