import type { ReactNode } from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  variantStyles,
  iconSizeMap,
} from "../_shared/styles";
import { buttonClassName } from "./styles";
import { ButtonContent } from "./ButtonContent";
import { type ButtonBaseProps } from "./Button";
import { Icon, type IconValue } from "../Icon";
import { Tooltip } from "../Tooltip";

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
  return (
    <AriaLink
      {...props}
      isDisabled={isDisabled || isLoading}
      className={buttonClassName({
        variant,
        size,
        isLoading,
        className,
        extra: "no-underline",
      })}
    >
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

// --- IconButtonLink ---

export interface IconButtonLinkProps extends Omit<AriaLinkProps, "className"> {
  /** Icon to render */
  icon: IconValue;
  /** Required for accessibility — also used as tooltip content */
  "aria-label": string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

export function IconButtonLink({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  showTooltip = true,
  className,
  ...props
}: IconButtonLinkProps) {
  const link = (
    <AriaLink
      {...props}
      aria-label={ariaLabel}
      className={twMerge(
        `
          inline-flex items-center justify-center cursor-pointer
          rounded-md
          outline-none transition-colors no-underline
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        `,
        variantStyles[variant],
        squareSizeStyles[size],
        className,
      )}
    >
      <Icon icon={icon} size={iconSizeMap[size]} />
    </AriaLink>
  );

  if (showTooltip) {
    return <Tooltip content={ariaLabel}>{link}</Tooltip>;
  }

  return link;
}
