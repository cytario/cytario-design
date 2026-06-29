import type { ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import {
  type ButtonSize,
  type ButtonVariant,
  sizeStyles,
  variantStyles,
} from "../_shared/styles";
import { ButtonContent } from "./ButtonContent";
import { type IconValue } from "../Icon";
import { twMerge } from "tailwind-merge";

export type { ButtonVariant, ButtonSize };

/** Shared visual props for the button family (Button, ButtonLink). */
export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: IconValue;
  iconRight?: IconValue;
  className?: string;
}

export type ButtonProps = Omit<AriaButtonProps, "className"> & ButtonBaseProps;

/** Layout, shape and state classes shared by the text buttons (Button, ButtonLink). */
export const buttonBaseClass = `
  inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer
  rounded-full
  font-medium
  leading-tight
  outline-none transition-colors no-underline
  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:opacity-50 disabled:pointer-events-none
`;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonProps) {
  const cx = twMerge(
    buttonBaseClass,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return (
    <AriaButton {...props} isDisabled={isDisabled || isLoading} className={cx}>
      <ButtonContent
        isLoading={isLoading}
        size={size}
        iconLeft={iconLeft}
        iconRight={iconRight}
      >
        {children as ReactNode}
      </ButtonContent>
    </AriaButton>
  );
}
