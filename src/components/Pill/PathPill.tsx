import { twMerge } from "tailwind-merge";
import { Pill, type PillColor, pillColorFromName } from "./Pill";

export interface PathPillProps {
  children: string;
  /** Number of trailing segments to show; earlier ones collapse to dots. Defaults to all. */
  visibleCount?: number;
  /** Override per-segment color. Falls back to hash-based `pillColorFromName`. */
  colorFn?: (segment: string, index: number) => PillColor;
  className?: string;
}

/** Renders a slash-separated path as overlapping, hash-colored pill segments. */
export function PathPill({
  children,
  visibleCount,
  colorFn,
  className,
}: PathPillProps) {
  const segments = children.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const effectiveVisible = visibleCount ?? segments.length;
  const dotCount = Math.max(0, segments.length - effectiveVisible);
  const fullPath = segments.join(" / ");

  return (
    <div
      className={twMerge("relative flex", className)}
      aria-label={`Path: ${fullPath}`}
    >
      {segments.map((segment, i) => {
        const isCollapsed = i < dotCount;
        const isLast = i === segments.length - 1;
        const cx = twMerge(!isLast && "pr-5 -mr-4", isCollapsed && "pr-3");
        const color = colorFn ? colorFn(segment, i) : pillColorFromName(segment);
        return (
          <Pill
            key={`pill-${i}-${segment}`}
            className={cx}
            color={color}
            aria-hidden={isCollapsed || undefined}
          >
            {isCollapsed ? undefined : segment}
          </Pill>
        );
      })}
    </div>
  );
}
