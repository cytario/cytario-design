import type React from "react";

export interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function InputGroup({ children, className }: InputGroupProps) {
  return (
    <div
      className={[
        "flex items-stretch",
        "[&>*:first-child]:rounded-r-none",
        "[&>*:last-child]:rounded-l-none",
        "[&>*:not(:first-child):not(:last-child)]:rounded-none",
        "[&>*+*]:-ml-px",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
