import {
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
} from "react-aria-components";

export interface LabelProps extends Omit<AriaLabelProps, "className"> {
  isRequired?: boolean;
  className?: string;
}

export function Label({ isRequired, children, className, ...props }: LabelProps) {
  return (
    <AriaLabel
      {...props}
      className={[
        "text-[length:var(--font-size-sm)]",
        "font-[number:var(--font-weight-medium)]",
        "text-[var(--color-text-primary)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {isRequired && (
        <span
          aria-hidden="true"
          className="ml-0.5 text-[var(--color-text-danger)]"
        >
          *
        </span>
      )}
    </AriaLabel>
  );
}
