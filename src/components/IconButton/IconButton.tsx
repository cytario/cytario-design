import type { ElementType } from "react";
import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  type ButtonSize,
  variantStyles,
} from "../_shared/styles";
import { type ButtonProps, type ButtonLinkProps } from "../Button";
import { buttonBaseClass } from "../Button/Button";
import { Icon, type IconValue } from "../Icon";
import { Spinner } from "../Spinner";
import { Tooltip } from "../Tooltip";

export const squareSizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 w-7", // 28px
  sm: "h-8 w-8", // 32px
  md: "h-10 w-10", // 40px
  lg: "h-12 w-12", // 48px
};

interface IconButtonBaseProps {
  as: ElementType;
  icon: IconValue;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

/**
 * Shared square icon button: builds the className, wraps in a Tooltip, and
 * renders the icon (or a spinner while loading). The wrapper element is
 * polymorphic via `as`; the public IconButton/IconButtonLink pass their own
 * precisely-typed props through.
 */
function IconButtonBase({
  as: Component,
  icon,
  label,
  variant = "ghost",
  size = "md",
  isLoading = false,
  isDisabled,
  className,
  ...props
}: IconButtonBaseProps & Record<string, unknown>) {
  const cx = twMerge(
    buttonBaseClass,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    squareSizeStyles[size],
    className,
  );

  return (
    <Tooltip content={label}>
      <Component
        {...props}
        aria-label={label}
        isDisabled={isDisabled || isLoading}
        className={cx}
      >
        {isLoading ? <Spinner size={size} /> : <Icon icon={icon} size={size} />}
      </Component>
    </Tooltip>
  );
}

export type IconButtonProps = Omit<ButtonProps, "iconLeft" | "iconRight"> & {
  icon: IconValue;
  label: string;
};

export function IconButton(props: IconButtonProps) {
  return <IconButtonBase as={AriaButton} {...props} />;
}

export type IconButtonLinkProps = Omit<
  ButtonLinkProps,
  "iconLeft" | "iconRight"
> & {
  icon: IconValue;
  label: string;
};

export function IconButtonLink(props: IconButtonLinkProps) {
  return <IconButtonBase as={AriaLink} {...props} />;
}
