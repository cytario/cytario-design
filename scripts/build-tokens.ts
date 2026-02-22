import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import StyleDictionary from "style-dictionary";

const CSS_BUILD_PATH = "src/tokens/";

const modes = [
  {
    name: "light",
    source: ["tokens/base.json", "tokens/semantic.json"],
    selector: ":root",
    dest: "variables.css",
  },
  {
    name: "dark",
    source: ["tokens/base.json", "tokens/themes/dark/semantic.json"],
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
