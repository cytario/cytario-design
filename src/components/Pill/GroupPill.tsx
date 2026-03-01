import type React from "react";
import { twMerge } from "tailwind-merge";
import { Pill, pillColorFromName, dotColorStyles } from "./Pill";

export interface GroupPillProps {
  /**
   * Slash-separated group path, e.g. `"/org/team/admins"`.
   * Leading slash is optional and stripped before splitting.
   */
  path: string;
  /**
   * Maximum number of path segments to display as full pills.
   * Extra leading segments are collapsed into small colored dots.
   * @default 3
   */
  visibleCount?: number;
  /** Additional CSS class names merged via tailwind-merge */
  className?: string;
}

/**
 * GroupPill -- displays a hierarchical group path as a row of
 * deterministically-colored pills. When the path has more segments
 * than `visibleCount`, the leading overflow segments are shown as
 * small colored dots to preserve context without consuming space.
 */
export function GroupPill({
  path,
  visibleCount = 3,
  className,
}: GroupPillProps) {
  // Normalise: strip leading/trailing slashes, split, drop empty segments
  const segments = path
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) return null;

  const hiddenCount = Math.max(0, segments.length - visibleCount);
  const hiddenSegments = segments.slice(0, hiddenCount);
  const visibleSegments = segments.slice(hiddenCount);

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1",
        className,
      )}
      aria-label={`Group: ${segments.join(" / ")}`}
    >
      {/* Collapsed dots for hidden leading segments */}
      {hiddenSegments.map((segment) => {
        const color = pillColorFromName(segment);
        return (
          <span
            key={`dot-${segment}`}
            className={twMerge(
              "inline-block size-2 shrink-0 rounded-full",
              dotColorStyles[color],
            )}
            aria-hidden="true"
            title={segment}
          />
        );
      })}

      {/* Visible segment pills */}
      {visibleSegments.map((segment) => (
        <Pill key={`pill-${segment}`} name={segment}>
          {segment}
        </Pill>
      ))}
    </span>
  );
}
