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
        "text-sm",
        "font-medium",
        "text-foreground",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {isRequired && (
        <span
          aria-hidden="true"
          className="ml-0.5 text-destructive"
        >
          *
        </span>
      )}
    </AriaLabel>
  );
}
