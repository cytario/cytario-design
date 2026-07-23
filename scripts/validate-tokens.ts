/**
 * Dark-theme invariant checker.
 *
 * Verifies that every semantic `--color-*` token defined under `:root` in
 * `src/styles/theme.css` also has a corresponding override under
 * `[data-theme="dark"]`. Primitives (raw hex/rgba values) are theme-agnostic
 * and excluded from the check — only var()-backed semantics need a dark
 * counterpart.
 *
 * Run: npm run validate:tokens
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_CSS = join(__dirname, "..", "src", "styles", "theme.css");

const css = readFileSync(THEME_CSS, "utf-8");

function extractSemanticTokens(selector: string): Set<string> {
  const re = new RegExp(
    selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*\\{([^}]*)\\}",
    "g",
  );
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const body = m[1];
    for (const line of body.split("\n")) {
      const sem = line.match(/^\s*(--color-[a-z0-9-]+)\s*:\s*var\(/);
      if (sem) names.add(sem[1]);
    }
  }
  return names;
}

const lightSemantic = extractSemanticTokens(":root");
const darkVars = extractSemanticTokens('[data-theme="dark"]');

const missing = [...lightSemantic].filter((v) => !darkVars.has(v));

if (missing.length > 0) {
  console.error(
    `✗ ${missing.length} semantic color token(s) missing from [data-theme="dark"]:\n` +
      missing.map((v) => `  ${v}`).join("\n"),
  );
  process.exit(1);
}

console.error(`✓ All ${lightSemantic.size} :root semantic color tokens have dark-mode overrides.`);
