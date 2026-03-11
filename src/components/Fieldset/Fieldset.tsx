import type React from "react";

export interface FieldsetProps {
  legend?: string;
  children: React.ReactNode;
  className?: string;
}

export function Fieldset({ legend, children, className }: FieldsetProps) {
  return (
    <fieldset
      className={[
        "flex flex-col gap-8",
        "border-none p-0 m-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {legend && (
        <legend
          className={[
            "text-lg",
            "font-semibold",
            "text-(--color-text-primary)",
            "p-0",
          ].join(" ")}
        >
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
}
