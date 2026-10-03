/**
 * Dark-theme invariant checker.
 *
 * 1. Verifies that every semantic `--color-*` token defined under `:root` in
 *    `src/styles/theme.css` also has a corresponding override under
 *    `[data-theme="dark"]`. Primitives (raw hex/rgba values) are theme-agnostic
 *    and excluded from the check — only var()-backed semantics need a dark
 *    counterpart.
 * 2. WCAG contrast gate: the semantic text/background and border/background
 *    pairs must clear AA in both themes (4.5:1 text, 3:1 UI boundaries).
 * 3. Dusk-ramp drift gate: the checked-in dusk hex values must match the
 *    canonical OKLCH parameter table (scripts/lib/dusk-ramp.ts) — the ramp's
 *    source of truth. A hand-edited dusk value that falls off the OKLCH
 *    line fails here instead of shipping.
 *
 * Shares the token parser with the generated docs catalog — the CI gate and
 * the Colors page can never disagree about what the tokens are.
 *
 * Run: npm run validate:tokens
 */

import { wcagContrast, oklch as toOklch } from "culori";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseTokenCatalog } from "./lib/token-catalog.ts";
import { DUSK_STEPS, DUSK_HUE, duskHex } from "./lib/dusk-ramp.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_CSS = join(__dirname, "..", "src", "styles", "theme.css");

const css = readFileSync(THEME_CSS, "utf-8");
const { lightRaw, darkRaw, rows } = parseTokenCatalog(css);

// --- 1. dark-parity check ---------------------------------------------------

const lightSemantic = [...lightRaw.entries()]
  .filter(([, v]) => v.startsWith("var("))
  .map(([k]) => k);
const missing = lightSemantic.filter((v) => !darkRaw.has(v));

if (missing.length > 0) {
  console.error(
    `✗ ${missing.length} semantic color token(s) missing from [data-theme="dark"]:\n` +
      missing.map((v) => `  ${v}`).join("\n"),
  );
  process.exit(1);
}

console.error(
  `✓ All ${lightSemantic.length} :root semantic color tokens have dark-mode overrides.`,
);

// --- 2. WCAG contrast gate --------------------------------------------------

// [foreground, background, minimum ratio, kind]
const PAIRS: Array<[string, string, number, string]> = [
  ["foreground", "background", 4.5, "text"],
  ["muted-foreground", "background", 4.5, "text"],
  ["foreground", "muted", 4.5, "text"],
  ["accent-foreground", "accent", 4.5, "text"],
  ["primary-foreground", "primary", 4.5, "text"],
  ["secondary-foreground", "secondary", 4.5, "text"],
  ["destructive-foreground", "destructive", 4.5, "text"],
  ["destructive-surface-foreground", "destructive-surface", 4.5, "text"],
  ["success-foreground", "success", 4.5, "text"],
  ["success-surface-foreground", "success-surface", 4.5, "text"],
  ["warning-foreground", "warning", 4.5, "text"],
  ["warning-surface-foreground", "warning-surface", 4.5, "text"],
  ["info-foreground", "info", 4.5, "text"],
  ["info-surface-foreground", "info-surface", 4.5, "text"],
  // ring doubles as link/tab text, so it must clear AA text, not just UI.
  ["ring", "background", 4.5, "text"],
  ...["purple", "teal", "dusk", "rose", "green", "amber"].flatMap(
    (h): Array<[string, string, number, string]> => [
      [`badge-${h}-text`, `badge-${h}-bg`, 4.5, "text"],
    ],
  ),
  ...["increase", "decrease", "flat"].flatMap(
    (d): Array<[string, string, number, string]> => [
      [`delta-${d}-text`, `delta-${d}-bg`, 4.5, "text"],
    ],
  ),
];

// Fill-vs-canvas boundary ratios (primary/secondary/background) and plain
// borders are deliberately not gated: labels carry identification and default
// borders are decorative dividers (WCAG 1.4.11 covers state-relevant
// boundaries only — the focus ring above is gated). The accepted fill
// compromises are documented inline in theme.css.

const byName = new Map(rows.map((r) => [r.name, r]));
let failures = 0;
let checked = 0;

for (const [theme, key] of [
  ["light", "light"],
  ["dark", "dark"],
] as const) {
  for (const [fgName, bgName, min, kind] of PAIRS) {
    let fg = byName.get(`--color-${fgName}`)?.[key];
    let bg = byName.get(`--color-${bgName}`)?.[key];
    // Outline treatment (dark secondary): the fill token is transparent, so
    // the text actually sits on the page background showing through. Check
    // against that instead — comparing fg to a non-color is meaningless. The
    // hover/pressed washes (12%/20% alpha) stay close to the base surface and
    // are measured inline in theme.css.
    if (bg === "transparent") {
      bg = byName.get("--color-background")?.[key];
    }
    const ratio = fg && bg ? wcagContrast(fg, bg) : undefined;
    if (fg === undefined || bg === undefined || ratio === undefined) {
      console.error(
        `⚠ ${theme}: cannot resolve ${fgName}/${bgName} (${fg ?? "—"} / ${bg ?? "—"}) — skipped`,
      );
      continue;
    }
    checked++;
    if (ratio < min) {
      failures++;
      console.error(
        `✗ ${theme} ${kind}: ${fgName} on ${bgName} = ${ratio.toFixed(2)}:1 (needs ${min}:1) [${fg} on ${bg}]`,
      );
    }
  }
}

if (failures > 0) {
  console.error(
    `✗ ${failures} contrast failure(s) across ${checked} checked pairs.`,
  );
  process.exit(1);
}

console.error(`✓ ${checked} contrast pairs pass WCAG AA in both themes.`);

// --- 3. dusk-ramp drift gate -------------------------------------------------

// The dusk ramp is one OKLCH line; the parameter table in lib/dusk-ramp.ts is
// its source of truth. Every checked-in dusk value must (a) byte-match the
// hex generated from the table and (b) sit on the line's hue. Editing a
// dusk hex by hand — or drifting the table without regenerating — fails here.
let rampFailures = 0;
for (const s of DUSK_STEPS) {
  const checkedIn = lightRaw.get(`--color-dusk-${s.step}`);
  const generated = duskHex(s);
  if (checkedIn !== generated) {
    rampFailures++;
    console.error(
      `✗ dusk-${s.step}: checked-in ${checkedIn ?? "(missing)"} ≠ generated ${generated} — regenerate from scripts/lib/dusk-ramp.ts`,
    );
    continue;
  }
  // Belt-and-braces: the generated value's own hue must stay near the line.
  const h = toOklch(generated).h;
  if (h === undefined || Math.abs(h - DUSK_HUE) > 4) {
    rampFailures++;
    console.error(
      `✗ dusk-${s.step}: hue ${h?.toFixed(1)}° is more than 4° off the OKLCH line (${DUSK_HUE}°) — fix the parameter table`,
    );
  }
}
if (rampFailures > 0) {
  console.error(
    `✗ ${rampFailures} dusk ramp drift failure(s) — the ramp must stay on its OKLCH line (scripts/lib/dusk-ramp.ts is the source of truth).`,
  );
  process.exit(1);
}
console.error(
  `✓ dusk ramp on its OKLCH line: ${DUSK_STEPS.length} steps byte-match scripts/lib/dusk-ramp.ts.`,
);
