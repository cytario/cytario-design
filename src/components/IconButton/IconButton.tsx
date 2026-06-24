import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import {
  type ButtonVariant,
  variantStyles,
  iconSizeMap,
} from "../_shared/styles";
import { Icon, type IconValue } from "../Icon";
import { Spinner } from "../Spinner";
import { Tooltip } from "../Tooltip";

export interface IconButtonProps extends Omit<AriaButtonProps, "className"> {
  /** Icon to render */
  icon: IconValue;
  /** Required for accessibility — also used as tooltip content */
  "aria-label": string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show tooltip on hover (default true) */
  showTooltip?: boolean;
  /** Shows a spinner and disables interaction */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const squareSizeStyles = {
  xs: "h-7 w-7", // 28px
  sm: "h-8 w-8", // 32px
  md: "h-10 w-10", // 40px
  lg: "h-12 w-12", // 48px
} as const;

export function IconButton({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  showTooltip = true,
  isLoading = false,
  isDisabled,
  className,
  ...props
}: IconButtonProps) {
  const cx = twMerge(
    `
      inline-flex items-center justify-center shrink-0 cursor-pointer
      rounded-full
      outline-none transition-colors
      focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none
    `,
    isLoading ? "pointer-events-none" : "",
    variantStyles[variant],
    squareSizeStyles[size],
    className,
  );

  const button = (
    <AriaButton
      {...props}
      aria-label={ariaLabel}
      isDisabled={isDisabled || isLoading}
      className={cx}
    >
      {isLoading ? (
        <Spinner size={iconSizeMap[size]} />
      ) : (
        <Icon icon={icon} size={iconSizeMap[size]} />
      )}
    </AriaButton>
  );

  if (showTooltip) {
    return <Tooltip content={ariaLabel}>{button}</Tooltip>;
  }

  return button;
}
