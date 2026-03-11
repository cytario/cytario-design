import type React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Available pill color variants, mapped to existing badge design tokens.
 *
 * The seven base variants correspond 1:1 to the `--color-badge-*` token set
 * defined in `tokens/semantic.json`.
 */
export type PillColor =
  | "neutral"
  | "purple"
  | "teal"
  | "rose"
  | "slate"
  | "green"
  | "amber";

export interface PillProps {
  /** Pill label content */
  children: React.ReactNode;
  /**
   * Explicit color variant, or `"auto"` to derive from `name` via
   * deterministic hash. Defaults to `"auto"` when `name` is provided,
   * `"neutral"` otherwise.
   */
  color?: PillColor | "auto";
  /**
   * String used for deterministic hash-based color assignment.
   * When provided and `color` is `"auto"` (or omitted), the pill color
   * is derived from this value so the same name always produces the same
   * color across renders and sessions.
   */
  name?: string;
  /** Additional CSS class names merged via tailwind-merge */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Deterministic hash -> color mapping                                */
/* ------------------------------------------------------------------ */

/**
 * Ordered color palette used by the hash function. The sequence mirrors
 * the cytario-web `pillColors` array, with each entry mapped to the
 * nearest available badge token variant.
 *
 * cytario-web name -> design-system badge variant
 *   sky      -> teal
 *   amber    -> amber
 *   emerald  -> green
 *   rose     -> rose
 *   violet   -> purple
 *   orange   -> amber  (closest warm tone with existing tokens)
 *   teal     -> teal
 *   fuchsia  -> rose   (closest pink tone with existing tokens)
 */
const HASH_PALETTE: PillColor[] = [
  "teal",   // sky
  "amber",  // amber
  "green",  // emerald
  "rose",   // rose
  "purple", // violet
  "amber",  // orange  (mapped to amber -- closest warm token)
  "teal",   // teal
  "rose",   // fuchsia (mapped to rose -- closest pink token)
];

/**
 * Deterministic string-to-color hash, matching the algorithm used in
 * cytario-web's `Pill.tsx`.
 */
export function pillColorFromName(name: string): PillColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return HASH_PALETTE[Math.abs(hash) % HASH_PALETTE.length];
}

/* ------------------------------------------------------------------ */
/*  Variant styles                                                     */
/* ------------------------------------------------------------------ */

const colorStyles: Record<PillColor, string> = {
  neutral:
    "bg-(--color-badge-neutral-bg) text-(--color-badge-neutral-text)",
  purple:
    "bg-(--color-badge-purple-bg) text-(--color-badge-purple-text)",
  teal:
    "bg-(--color-badge-teal-bg) text-(--color-badge-teal-text)",
  rose:
    "bg-(--color-badge-rose-bg) text-(--color-badge-rose-text)",
  slate:
    "bg-(--color-badge-slate-bg) text-(--color-badge-slate-text)",
  green:
    "bg-(--color-badge-green-bg) text-(--color-badge-green-text)",
  amber:
    "bg-(--color-badge-amber-bg) text-(--color-badge-amber-text)",
};

/**
 * CSS class for the dot indicator used in GroupPill collapsed segments.
 * Exported so GroupPill can reuse it without duplicating the mapping.
 */
export const dotColorStyles: Record<PillColor, string> = {
  neutral: "bg-(--color-badge-neutral-text)",
  purple:  "bg-(--color-badge-purple-text)",
  teal:    "bg-(--color-badge-teal-text)",
  rose:    "bg-(--color-badge-rose-text)",
  slate:   "bg-(--color-badge-slate-text)",
  green:   "bg-(--color-badge-green-text)",
  amber:   "bg-(--color-badge-amber-text)",
};

/* ------------------------------------------------------------------ */
/*  Resolve effective color                                            */
/* ------------------------------------------------------------------ */

function resolveColor(
  color: PillColor | "auto" | undefined,
  name: string | undefined,
): PillColor {
  if (color && color !== "auto") return color;
  if (name) return pillColorFromName(name);
  return "neutral";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Pill -- a small, rounded label used for tags, user groups, and status
 * indicators. Supports deterministic hash-based coloring so the same
 * `name` always renders the same color.
 */
export function Pill({ children, color, name, className }: PillProps) {
  const resolved = resolveColor(color, name);

  return (
    <span
      className={twMerge(
        "inline-flex items-center rounded-full",
        "px-2 py-0.5",
        "text-xs font-medium leading-tight",
        colorStyles[resolved],
        className,
      )}
    >
      {children}
    </span>
  );
}
