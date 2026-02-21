export interface SpinnerProps {
  /** Size preset */
  size?: "sm" | "md" | "lg";
  /** Accessible label — when provided, the spinner is announced to screen readers */
  "aria-label"?: string;
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

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
      className={[sizeMap[size], "animate-spin", className]
        .filter(Boolean)
        .join(" ")}
      viewBox="0 0 24 24"
      fill="none"
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
