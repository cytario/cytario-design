/**
 * Source-level parser for the design token catalog in src/styles/theme.css.
 *
 * The single parsing authority for everything that needs to know what tokens
 * exist: the WCAG gate (validate-tokens) and the generated docs catalog
 * (generate-token-catalog). Parses the CSS *source* — brace-aware, so nested
 * @supports blocks (color-mix fallbacks) and declarations that follow them are
 * handled — never the compiled stylesheet, whose CSSOM shape is
 * browser-specific.
 */

export interface TokenRow {
  /** Full custom property name, e.g. "--color-primary". */
  name: string;
  /** Resolved leaf value under light (hex / rgba / keyword). */
  light: string;
  /** Resolved value under dark; falls back to the light value. */
  dark: string;
  /** Bare primitive this token aliases per theme, e.g. "purple-700". */
  mapsToLight?: string;
  mapsToDark?: string;
}

export interface TokenCatalog {
  /** Raw declared values, e.g. "var(--color-white)" or "#f8fafc". */
  lightRaw: Map<string, string>;
  darkRaw: Map<string, string>;
  rows: TokenRow[];
}

/** Remove /* … *​/ comments so example code in docs comments can't parse. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** Extract the balanced-brace body of `selector`'s declaration block. */
function extractBlock(css: string, selector: string): string | null {
  const re = new RegExp(
    `(?:^|[\\s{,>])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`,
    "g",
  );
  const m = re.exec(css);
  if (!m) return null;
  const start = m.index + m[0].length;
  let depth = 1;
  for (let i = start; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i);
    }
  }
  return null;
}

function parseBlockVars(body: string): Map<string, string> {
  const vars = new Map<string, string>();
  const re = /^\s*(--color-[a-z0-9-]+)\s*:\s*([^;]+);/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    vars.set(m[1], m[2].trim());
  }
  return vars;
}

/** Follow a var() chain to its leaf value; null on unresolvable or cyclic. */
export function resolveValue(
  vars: Map<string, string>,
  value: string,
): string | null {
  let current = value;
  for (let i = 0; i < 16; i++) {
    const m = current.match(/^var\(\s*(--color-[a-z0-9-]+)\s*\)$/);
    if (!m) return /^#[0-9a-fA-F]{3,8}$|^(?:rgba?|hsla?)\(|^[a-z]+$/.test(current) ? current : null;
    const next = vars.get(m[1]);
    if (next === undefined) return null;
    current = next;
  }
  return null;
}

/** If a declared value is a single var(--color-X), return bare "X". */
function aliasOf(rawValue: string | undefined): string | undefined {
  const m = rawValue?.match(/^var\(\s*--color-([a-z0-9-]+)\s*\)$/);
  return m ? m[1] : undefined;
}

export function parseTokenCatalog(css: string): TokenCatalog {
  const clean = stripComments(css);
  const lightRaw = parseBlockVars(extractBlock(clean, ":root") ?? "");
  const darkRaw = parseBlockVars(
    extractBlock(clean, '[data-theme="dark"]') ?? "",
  );

  const rows: TokenRow[] = [...lightRaw.keys()].sort().map((name) => {
    const light = resolveValue(lightRaw, lightRaw.get(name)!) ?? "";
    // The dark block layers on top of :root — primitives resolve through it.
    const merged = new Map([...lightRaw, ...darkRaw]);
    const darkRawValue = darkRaw.get(name);
    const dark = darkRawValue
      ? (resolveValue(merged, darkRawValue) ?? light)
      : light;
    return {
      name,
      light,
      dark,
      mapsToLight: aliasOf(lightRaw.get(name)),
      mapsToDark: aliasOf(darkRawValue) ?? aliasOf(lightRaw.get(name)),
    };
  });

  return { lightRaw, darkRaw, rows };
}
