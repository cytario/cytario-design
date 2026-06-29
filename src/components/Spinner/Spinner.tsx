import { twMerge } from "tailwind-merge";
import { ButtonSize } from "../_shared/styles";
import { sizeMap } from "../Icon/Icon";

export interface SpinnerProps {
  size?: ButtonSize;
  "aria-label"?: string;
  className?: string;
}

export function Spinner({
  size = "md",
  "aria-label": ariaLabel,
  className,
}: SpinnerProps) {
  const isDecorative = !ariaLabel;

  return (
    <svg
      role={isDecorative ? undefined : "status"}
      aria-label={ariaLabel}
      aria-hidden={isDecorative ? "true" : undefined}
      className={twMerge("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      width={sizeMap[size]}
      height={sizeMap[size]}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
