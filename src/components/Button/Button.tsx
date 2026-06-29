import type { ElementType, ReactNode } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonSize,
  type ButtonVariant,
  sizeStyles,
  variantStyles,
  iconSizeMap,
} from "../_shared/styles";
import { Icon, type IconValue } from "../Icon";
import { Spinner } from "../Spinner";

export type { ButtonVariant, ButtonSize };

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

/** Shared visual props for the button family (Button, ButtonLink). */
export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: IconValue;
  iconRight?: IconValue;
  className?: string;
}

/**
 * Shared text button: builds the className and renders the icon/label/icon
 * content (or a spinner while loading). The wrapper element is polymorphic via
 * `as`; the public Button/ButtonLink pass their own precisely-typed props.
 */
function ButtonBase({
  as: Component,
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonBaseProps & {
  as: ElementType;
  isDisabled?: boolean;
} & Record<string, unknown>) {
  const cx = twMerge(
    buttonBaseClass,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  return (
    <Component {...props} isDisabled={isDisabled || isLoading} className={cx}>
      {isLoading && <Spinner size={iconSizeMap[size]} />}
      {!isLoading && iconLeft && <Icon icon={iconLeft} size={iconSizeMap[size]} />}
      {children as ReactNode}
      {!isLoading && iconRight && (
        <Icon icon={iconRight} size={iconSizeMap[size]} />
      )}
    </Component>
  );
}

export type ButtonProps = Omit<AriaButtonProps, "className"> & ButtonBaseProps;

export function Button(props: ButtonProps) {
  return <ButtonBase as={AriaButton} {...props} />;
}

export type ButtonLinkProps = Omit<AriaLinkProps, "className"> & ButtonBaseProps;

export function ButtonLink(props: ButtonLinkProps) {
  return <ButtonBase as={AriaLink} {...props} />;
}
