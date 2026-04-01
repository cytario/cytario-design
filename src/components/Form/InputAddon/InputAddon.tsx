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
      return "rounded-l-(--border-radius-md) rounded-r-none";
    case "middle":
      return "rounded-none";
    case "end":
      return "rounded-r-(--border-radius-md) rounded-l-none";
    default:
      return "rounded-md";
  }
}

export function InputAddon({ children, className }: InputAddonProps) {
  const { inGroup, position } = useInputGroup();

  const radiusClass = inGroup
    ? groupRadiusClass(position)
    : "rounded-md";

  const marginClass =
    inGroup && position !== "start" && position !== "standalone"
      ? "-ml-px"
      : "";

  return (
    <div
      className={[
        "flex items-center self-stretch shrink-0 select-none",
        "px-3 py-2 text-base",
        "bg-(--color-surface-subtle)",
        "text-(--color-text-secondary)",
        "border border-(--color-border-default)",
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
