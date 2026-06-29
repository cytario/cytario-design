import type { ReactNode } from "react";
import { type ButtonSize, iconSizeMap } from "../_shared/styles";
import { Icon, type IconValue } from "../Icon";
import { Spinner } from "../Spinner";

interface ButtonContentProps {
  isLoading?: boolean;
  size: ButtonSize;
  iconLeft?: IconValue;
  iconRight?: IconValue;
  children?: ReactNode;
}

/** Leading spinner/icon, label, and trailing icon shared by Button and ButtonLink. */
export function ButtonContent({
  isLoading,
  size,
  iconLeft,
  iconRight,
  children,
}: ButtonContentProps) {
  return (
    <>
      {isLoading && <Spinner size={iconSizeMap[size]} />}
      {!isLoading && iconLeft && (
        <Icon icon={iconLeft} size={iconSizeMap[size]} />
      )}
      {children}
      {!isLoading && iconRight && (
        <Icon icon={iconRight} size={iconSizeMap[size]} />
      )}
    </>
  );
}
