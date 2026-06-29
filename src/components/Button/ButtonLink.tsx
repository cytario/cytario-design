import type { ReactNode } from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { ButtonContent } from "./ButtonContent";
import { buttonBaseClass, type ButtonBaseProps } from "./Button";
import { twMerge } from "tailwind-merge";
import { variantStyles, sizeStyles } from "../_shared/styles";

export type ButtonLinkProps = Omit<AriaLinkProps, "className"> &
  ButtonBaseProps;

export function ButtonLink({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const cx = twMerge(
    buttonBaseClass,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return (
    <AriaLink {...props} isDisabled={isDisabled || isLoading} className={cx}>
      <ButtonContent
        isLoading={isLoading}
        size={size}
        iconLeft={iconLeft}
        iconRight={iconRight}
      >
        {children as ReactNode}
      </ButtonContent>
    </AriaLink>
  );
}
