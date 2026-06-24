import type { ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { type Size, type ButtonVariant } from "../_shared/styles";
import { buttonClassName } from "./styles";
import { ButtonContent } from "./ButtonContent";
import { type IconValue } from "../Icon";

export type { ButtonVariant };
export type ButtonSize = Size;

/** Shared visual props for the button family (Button, ButtonLink). */
export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
  iconLeft?: IconValue;
  iconRight?: IconValue;
  className?: string;
}

export type ButtonProps = Omit<AriaButtonProps, "className"> & ButtonBaseProps;

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
  return (
    <AriaButton
      {...props}
      isDisabled={isDisabled || isLoading}
      className={buttonClassName({ variant, size, isLoading, className })}
    >
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
