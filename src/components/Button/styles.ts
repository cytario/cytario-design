import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  type Size,
  variantStyles,
  sizeStyles,
} from "../_shared/styles";

/** Layout, shape and state classes shared by the text buttons (Button, ButtonLink). */
export const buttonBaseClass = `
  inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer
  rounded-full
  font-medium
  leading-tight
  outline-none transition-colors
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
`;

/** Builds the merged className for a text button (Button, ButtonLink). */
export function buttonClassName({
  variant,
  size,
  isLoading,
  className,
  extra,
}: {
  variant: ButtonVariant;
  size: Size;
  isLoading?: boolean;
  className?: string;
  /** Extra classes appended before variant/size (e.g. `no-underline` for links). */
  extra?: string;
}): string {
  return twMerge(
    buttonBaseClass,
    extra,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}
