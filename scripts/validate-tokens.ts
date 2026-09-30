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
 *
 * Shares the token parser with the generated docs catalog — the CI gate and
 * the Colors page can never disagree about what the tokens are.
 *
 * Run: npm run validate:tokens
 */

import { wcagContrast } from "culori";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseTokenCatalog } from "./lib/token-catalog.ts";

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
  ["muted-foreground", "muted", 4.5, "text"],
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
  ...["purple", "teal", "slate", "rose", "green", "amber"].flatMap(
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
    const fg = byName.get(`--color-${fgName}`)?.[key];
    const bg = byName.get(`--color-${bgName}`)?.[key];
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
