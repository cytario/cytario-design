import { Separator } from "react-aria-components";

export interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className }: MenuSeparatorProps) {
  return (
    <Separator
      className={[
        "border-t border-[var(--color-border-default)] my-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
