import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import StyleDictionary from "style-dictionary";

const CSS_BUILD_PATH = "src/tokens/";
const CSS_FILENAME = "variables.css";

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: CSS_BUILD_PATH,
      files: [
        {
          destination: CSS_FILENAME,
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
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
const cssPath = join(CSS_BUILD_PATH, CSS_FILENAME);
const css = await readFile(cssPath, "utf-8");

// Split into file header comment and the :root block
const headerEnd = css.indexOf("*/") + 2;
const header = css.slice(0, headerEnd);
const rootBlock = css.slice(headerEnd).trim();

// Indent the :root block inside the layer
const indentedRoot = rootBlock
  .split("\n")
  .map((line) => (line.trim() ? `  ${line}` : line))
  .join("\n");

const layered = `${header}\n\n@layer cytario-design {\n${indentedRoot}\n}\n`;
await writeFile(cssPath, layered);

console.log("Design tokens built successfully (wrapped in @layer cytario-design).");
