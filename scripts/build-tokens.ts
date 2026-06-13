import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import StyleDictionary from "style-dictionary";

const CSS_BUILD_PATH = "src/tokens/";

// --- Dark-theme coverage assertion ---------------------------------------
// Every semantic token defined for light must have an explicit dark value;
// otherwise it silently falls through the CSS cascade to the light value
// (this is what left banner/delta/progress rendering light colors in dark).
const THEME_INVARIANT = new Set<string>([]); // intentionally identical across themes

type TokenNode = { $value?: unknown; [k: string]: unknown };
function flattenKeys(obj: Record<string, TokenNode>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$") || v == null || typeof v !== "object") continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if ("$value" in v) out.push(path);
    else out.push(...flattenKeys(v as Record<string, TokenNode>, path));
  }
  return out;
}

const lightJson = JSON.parse(await readFile("tokens/semantic.light.json", "utf-8"));
const darkJson = JSON.parse(await readFile("tokens/semantic.dark.json", "utf-8"));
const darkKeys = new Set(flattenKeys(darkJson.color, "color"));
const missingInDark = flattenKeys(lightJson.color, "color").filter(
  (k) => !darkKeys.has(k) && !THEME_INVARIANT.has(k),
);
if (missingInDark.length) {
  throw new Error(
    `Dark theme is missing ${missingInDark.length} semantic token(s) present in light:\n  ` +
      missingInDark.join("\n  ") +
      `\nAdd them to tokens/semantic.dark.json (or to THEME_INVARIANT in build-tokens.ts ` +
      `if a token is intentionally identical across themes).`,
  );
}

const modes = [
  {
    name: "light",
    source: ["tokens/primitives.json", "tokens/semantic.light.json"],
    selector: ":root",
    dest: "variables.css",
  },
  {
    name: "dark",
    source: ["tokens/primitives.json", "tokens/semantic.dark.json"],
    selector: '[data-theme="dark"]',
    dest: "variables-dark.css",
  },
];

for (const mode of modes) {
  const sd = new StyleDictionary({
    source: mode.source,
    usesDtcg: true,
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: CSS_BUILD_PATH,
        files: [
          {
            destination: mode.dest,
            format: "css/variables",
            options: {
              outputReferences: true,
              selector: mode.selector,
            },
          },
        ],
      },
      // Only generate TS output for light mode
      ...(mode.name === "light"
        ? {
            ts: {
              transformGroup: "js",
              buildPath: "src/tokens/",
              files: [
                {
                  destination: "tokens.ts",
                  format: "javascript/es6",
                },
              ],
            },
          }
        : {}),
    },
  });

  await sd.buildAllPlatforms();

  /**
   * Post-process: wrap generated CSS custom properties in a cascade layer.
   *
   * When consumers import `@cytario/design/tokens/variables.css`, the tokens
   * live inside `@layer cytario-design`. Because layered styles have lower
   * precedence than unlayered styles, consumer Tailwind v3 utilities applied
   * via `className` will reliably override our component defaults without
   * needing `!important`.
   */
  const cssPath = join(CSS_BUILD_PATH, mode.dest);
  const css = await readFile(cssPath, "utf-8");

  // Split into file header comment and the selector block
  const headerEnd = css.indexOf("*/") + 2;
  const header = css.slice(0, headerEnd);
  const selectorBlock = css.slice(headerEnd).trim();

  // Indent the selector block inside the layer
  const indentedBlock = selectorBlock
    .split("\n")
    .map((line) => (line.trim() ? `  ${line}` : line))
    .join("\n");

  const layered = `${header}\n\n@layer cytario-design {\n${indentedBlock}\n}\n`;
  await writeFile(cssPath, layered);

  console.log(`Design tokens built: ${mode.dest} (${mode.name} mode, wrapped in @layer cytario-design).`);
}
