import type React from "react";
import { useInputGroup } from "../InputGroup/InputGroupContext";

export interface InputAddonProps {
  children: React.ReactNode;
  className?: string;
}

function groupRadiusClass(
  position: "start" | "middle" | "end" | "standalone",
): string {
  switch (position) {
    case "start":
      return "rounded-l-[var(--border-radius-md)] rounded-r-none";
    case "middle":
      return "rounded-none";
    case "end":
      return "rounded-r-[var(--border-radius-md)] rounded-l-none";
    default:
      return "rounded-[var(--border-radius-md)]";
  }
}

export function InputAddon({ children, className }: InputAddonProps) {
  const { inGroup, position } = useInputGroup();

  const radiusClass = inGroup
    ? groupRadiusClass(position)
    : "rounded-[var(--border-radius-md)]";

  const marginClass =
    inGroup && position !== "start" && position !== "standalone"
      ? "-ml-px"
      : "";

  return (
    <div
      className={[
        "flex items-center self-stretch shrink-0 select-none",
        "px-3 py-2 text-base",
        "bg-[var(--color-surface-subtle)]",
        "text-[var(--color-text-secondary)]",
        "border border-[var(--color-border-default)]",
        radiusClass,
        marginClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
