import { twMerge } from "tailwind-merge";
import { Badge, type BadgeColor } from "../Badge";

const hashColors = [
  "purple",
  "teal",
  "rose",
  "green",
  "amber",
] as const satisfies BadgeColor[];

export function pillColorFromName(name = ""): BadgeColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hashColors[Math.abs(hash) % hashColors.length];
}

export interface PathPillProps {
  children: string;
  visibleCount?: number;
  colorFn?: (segment: string, index: number) => BadgeColor;
  className?: string;
}

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
          <Badge
            key={`pill-${i}-${segment}`}
            className={cx}
            color={color}
            aria-hidden={isCollapsed || undefined}
          >
            {isCollapsed ? undefined : segment}
          </Badge>
        );
      })}
    </div>
  );
}
