/**
 * Source of truth for the dusk neutral ramp (the purple-tinted ramp that
 * replaced slate in the dark-first relaunch).
 *
 * The ramp was originally generated on one OKLCH line — hue 299 (the brand
 * purple), chroma derived from Tailwind's slate chroma, Tailwind's lightness
 * curve with the dark end compressed through the relaunch anchor values
 * (dusk-700/800/900 carry the brand canvas ladder). The original scratch
 * formula is gone; these parameters were RECOVERED from the deployed hex
 * values (culori oklch() of each step), which roundtrip byte-stable —
 * generating from this table reproduces the shipped palette exactly.
 *
 * The table is now the authority: validate-tokens gates the checked-in dusk
 * values against it (hue stays on the line, hex matches generation), so
 * hand-edited drift fails CI instead of shipping.
 */
import { oklch, formatHex } from "culori";

export const DUSK_HUE = 299; // matches brand purple-700

/** Per-step OKLCH parameters, recovered from the deployed hex (see header). */
export const DUSK_STEPS: ReadonlyArray<{
  step: number;
  /** OKLCH lightness 0–1 */
  l: number;
  /** OKLCH chroma 0–0.4 */
  c: number;
  /** Measured hue; the small spread (~296–303) is a rounding artifact of the
   *  original generation, preserved exactly so regeneration is byte-stable. */
  h: number;
  /** The deployed value this parameter was recovered from — the regression
   *  baseline. If generation ever disagrees, this is the reference. */
  baselineHex: string;
}> = [
  { step: 50, l: 0.9837, c: 0.0041, h: 301.43, baselineHex: "#faf9fc" },
  { step: 100, l: 0.9677, c: 0.0095, h: 299.24, baselineHex: "#f5f3fa" },
  { step: 200, l: 0.9285, c: 0.0166, h: 301.2, baselineHex: "#e9e5f1" },
  { step: 300, l: 0.8684, c: 0.028, h: 299.49, baselineHex: "#d6d0e4" },
  { step: 400, l: 0.7038, c: 0.0504, h: 299.89, baselineHex: "#a499bb" },
  { step: 500, l: 0.5528, c: 0.0582, h: 299.36, baselineHex: "#776b90" },
  { step: 600, l: 0.4001, c: 0.0545, h: 299.73, baselineHex: "#4c4161" },
  { step: 700, l: 0.2459, c: 0.0831, h: 295.69, baselineHex: "#251543" },
  { step: 800, l: 0.2118, c: 0.0649, h: 298.31, baselineHex: "#1d1032" },
  { step: 900, l: 0.1784, c: 0.0527, h: 302.7, baselineHex: "#160a24" },
  { step: 950, l: 0.1453, c: 0.0543, h: 299.62, baselineHex: "#0e041d" },
];

/** Hex for one OKLCH parameter row — culori converts, clamped, lowercase. */
export function duskHex({ l, c, h }: { l: number; c: number; h: number }): string {
  return formatHex(oklch({ l, c, h }));
}

/** The full generated ramp, keyed by Tailwind-style step. */
export function duskRamp(): Record<number, string> {
  return Object.fromEntries(DUSK_STEPS.map((s) => [s.step, duskHex(s)]));
}
