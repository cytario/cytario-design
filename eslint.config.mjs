import tseslint from "typescript-eslint";

/**
 * Component source may only style itself with semantic design tokens.
 * Raw palette scales, white/black, and arbitrary hex values bypass the
 * semantic layer and stop components from adapting to theme. Stories and
 * tests are exempt: they deliberately simulate arbitrary backgrounds and
 * pass fixture class names through the components under test.
 */
export default tseslint.config(
  {
    ignores: [
      "**/*.stories.*",
      "**/*.test.*",
      "src/stories/**",
      "dist/**",
      "src/docs/Foundation/token-catalog.generated.ts",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(?:text|bg|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900|950)\\b/]",
          message:
            "Raw palette scales are design-system-internal — use semantic tokens (e.g. bg-background, text-muted-foreground, border-border).",
        },
        {
          selector:
            "TemplateElement[value.cooked=/(?:text|bg|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-[a-z]+-(?:50|100|200|300|400|500|600|700|800|900|950)\\b/]",
          message:
            "Raw palette scales are design-system-internal — use semantic tokens (e.g. bg-background, text-muted-foreground, border-border).",
        },
        {
          selector:
            "Literal[value=/(?:text|bg|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-(?:white|black)\\b/]",
          message:
            "white/black bypass the semantic layer and do not adapt to theme — use the token pair that matches the surface (e.g. text-primary-foreground, bg-background).",
        },
        {
          selector:
            "TemplateElement[value.cooked=/(?:text|bg|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide|accent|caret|placeholder)-(?:white|black)\\b/]",
          message:
            "white/black bypass the semantic layer and do not adapt to theme — use the token pair that matches the surface (e.g. text-primary-foreground, bg-background).",
        },
        {
          selector:
            "Literal[value=/[a-z]-\\[#[0-9a-fA-F]{3,8}\\]/]",
          message:
            "Arbitrary hex colors bypass the token system — use a semantic token; if none fits, that is a gap to raise with the design-system team.",
        },
        {
          selector:
            "TemplateElement[value.cooked=/[a-z]-\\[#[0-9a-fA-F]{3,8}\\]/]",
          message:
            "Arbitrary hex colors bypass the token system — use a semantic token; if none fits, that is a gap to raise with the design-system team.",
        },
      ],
    },
  },
);
