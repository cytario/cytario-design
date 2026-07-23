import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";

/**
 * Live color-token reference. Reads every `--color-*` custom property straight
 * from the loaded token stylesheet (`theme.css` — `:root` for light,
 * `[data-theme="dark"]` for dark) and resolves each under both themes.
 * Nothing is hardcoded, so this view cannot drift from the tokens.
 */

interface TokenRow {
  name: string;
  /** Resolved value as hex/rgba, e.g. "#5c2483". */
  light: string;
  dark: string;
  /** Primitive this token aliases per theme, e.g. "purple-700" (undefined for primitives). */
  mapsToLight?: string;
  mapsToDark?: string;
}

// Stepped hue scales, each its own gallery.
// slate (neutral) first, then hue scales by wavelength: red → violet.
const SCALE_GROUPS = [
  "slate",
  "rose",
  "amber",
  "green",
  "teal",
  "blue",
  "purple",
];
// Base primitives (black + white), shown atop the scales.
const BASE_GROUPS = ["black", "white"];
// Alpha scrims/overlays — their own gallery (rendered over a checkerboard).
const ALPHA_GROUP = "alpha";
// Everything primitive — excluded from the Semantic section.
const PALETTE_GROUPS = [...SCALE_GROUPS, ...BASE_GROUPS, ALPHA_GROUP];

function rgbToHex(rgb: string): string {
  // Preserve alpha colors (scrims) verbatim — they read better as rgba.
  if (rgb.startsWith("rgba") && !/,\s*1\)$/.test(rgb)) return rgb;
  const m = rgb.match(/[\d.]+/g);
  if (!m) return rgb;
  const [r, g, b] = m.map(Number);
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** Raw declared values per theme (e.g. "var(--color-white)" or "#f8fafc"). */
function collectDeclaredTokens(): {
  light: Map<string, string>;
  dark: Map<string, string>;
} {
  const light = new Map<string, string>();
  const dark = new Map<string, string>();

  // Token rules live inside `@layer cytario-design { :root { … } }` and may be
  // reached through `@import`, so walk grouping rules and imported sheets too.
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        const target =
          rule.selectorText === ":root"
            ? light
            : rule.selectorText === '[data-theme="dark"]'
              ? dark
              : null;
        if (target) {
          for (const prop of Array.from(rule.style)) {
            if (prop.startsWith("--color-"))
              target.set(prop, rule.style.getPropertyValue(prop).trim());
          }
        }
      } else if (rule instanceof CSSImportRule && rule.styleSheet) {
        try {
          walk(rule.styleSheet.cssRules);
        } catch {
          /* cross-origin — skip */
        }
      } else if ("cssRules" in rule) {
        walk((rule as CSSGroupingRule).cssRules);
      }
    }
  };

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walk(sheet.cssRules);
    } catch {
      continue; // cross-origin sheet — skip
    }
  }
  return { light, dark };
}

/** If a token's declared value is a single `var(--color-X)`, return "X". */
function aliasOf(rawValue: string | undefined): string | undefined {
  const m = rawValue?.match(/^var\(\s*--color-([a-z0-9-]+)\s*\)$/);
  return m ? m[1] : undefined;
}

function makeProbeHost(theme: "light" | "dark"): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute("data-theme", theme);
  el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
  document.body.appendChild(el);
  return el;
}

function resolveUnder(host: HTMLDivElement, token: string): string {
  const probe = document.createElement("div");
  probe.style.color = `var(${token})`;
  host.appendChild(probe);
  const value = getComputedStyle(probe).color;
  host.removeChild(probe);
  return rgbToHex(value);
}

function useTokens(): TokenRow[] | null {
  const [rows, setRows] = useState<TokenRow[] | null>(null);
  useEffect(() => {
    const declared = collectDeclaredTokens();
    const names = [...declared.light.keys()].sort();
    const lightHost = makeProbeHost("light");
    const darkHost = makeProbeHost("dark");
    const resolved = names.map((name) => ({
      name,
      light: resolveUnder(lightHost, name),
      dark: resolveUnder(darkHost, name),
      mapsToLight: aliasOf(declared.light.get(name)),
      mapsToDark: aliasOf(declared.dark.get(name) ?? declared.light.get(name)),
    }));
    document.body.removeChild(lightHost);
    document.body.removeChild(darkHost);
    setRows(resolved);
  }, []);
  return rows;
}

/**
 * Read Storybook's `theme` global from a docs component. Preview hooks
 * (useGlobals) only work inside decorators/stories, so subscribe to the addons
 * channel instead and seed the initial value from the URL's `globals` param.
 */
function useThemeGlobal(): string {
  const [theme, setTheme] = useState(() => {
    try {
      const g =
        new URLSearchParams(window.location.search).get("globals") ?? "";
      const entry = g
        .split(";")
        .map((s) => s.split(":"))
        .find(([k]) => k === "theme");
      return entry?.[1] || "light";
    } catch {
      return "light";
    }
  });
  useEffect(() => {
    const channel = addons.getChannel();
    const onGlobals = (p: { globals?: Record<string, string> }) => {
      if (p?.globals?.theme) setTheme(p.globals.theme);
    };
    channel.on("globalsUpdated", onGlobals);
    channel.on("setGlobals", onGlobals);
    return () => {
      channel.off("globalsUpdated", onGlobals);
      channel.off("setGlobals", onGlobals);
    };
  }, []);
  return theme;
}

function groupOf(name: string): string {
  return name.replace("--color-", "").split("-")[0];
}

function stepOf(name: string): number {
  const last = name.split("-").pop() ?? "";
  return /^\d+$/.test(last) ? Number(last) : Number.POSITIVE_INFINITY;
}

/** Bare token name without the `--color-` prefix, e.g. "muted-foreground". */
const bareName = (name: string) => name.replace("--color-", "");

// Semantic tokens use shadcn-aligned, property-agnostic names (background,
// foreground, primary, destructive…). They no longer share a family prefix, so
// they're grouped by an explicit section classifier instead of by first segment.
const NEUTRAL = new Set([
  "background",
  "foreground",
  "card",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "accent-pressed",
  "border",
  "ring",
]);

interface Section {
  key: string;
  label: string;
  desc: string;
  test: (n: string) => boolean;
}

const SECTIONS: Section[] = [
  {
    key: "neutral",
    label: "Neutral & chrome",
    desc: "The page base and structural neutrals. background / foreground are the canvas and its text; card is a raised surface, muted a recessed panel; accent is the neutral hover / selected highlight (with accent-foreground); muted-foreground is secondary text; border draws dividers and ring is the focus outline. These flip between light and dark.",
    test: (n) => NEUTRAL.has(n),
  },
  {
    key: "primary",
    label: "Primary — brand purple",
    desc: "The main call-to-action. primary fill + primary-foreground text, plus hover / pressed states. Colored solids stay constant across themes.",
    test: (n) => n === "primary" || n.startsWith("primary-"),
  },
  {
    key: "secondary",
    label: "Secondary — brand teal",
    desc: "Secondary action in cytario teal. Solid + foreground + hover. Constant across themes.",
    test: (n) => n === "secondary" || n.startsWith("secondary-"),
  },
  {
    key: "destructive",
    label: "Destructive — rose",
    desc: "Dangerous / irreversible actions and error messaging. The solid (+ foreground, hover) drives buttons; -surface / -surface-foreground / -border form inline alerts. Solid is constant; the surface/border pair flips per theme.",
    test: (n) => n === "destructive" || n.startsWith("destructive-"),
  },
  {
    key: "success",
    label: "Success — green",
    desc: "Positive confirmation. Solid (+ foreground, hover) for buttons; -surface / -surface-foreground / -border for inline success states.",
    test: (n) => n === "success" || n.startsWith("success-"),
  },
  {
    key: "warning",
    label: "Warning — amber",
    desc: "Cautions. Solid uses dark foreground for contrast on amber; -surface / -surface-foreground / -border for inline warnings.",
    test: (n) => n === "warning" || n.startsWith("warning-"),
  },
  {
    key: "info",
    label: "Info — blue",
    desc: "Neutral informational messaging. Solid (+ foreground, hover); -surface / -surface-foreground / -border for inline notices.",
    test: (n) => n === "info" || n.startsWith("info-"),
  },
  {
    key: "plumbing",
    label: "Overlay & backdrop",
    desc: "Scrims — overlay sits on dropdowns/tooltips, backdrop dims behind modal dialogs.",
    test: (n) => n === "overlay" || n === "backdrop",
  },
  {
    key: "badge",
    label: "Badge",
    desc: "Compact label colors keyed by palette hue (decorative), as background + text pairs.",
    test: (n) => n.startsWith("badge-"),
  },
  {
    key: "delta",
    label: "Delta",
    desc: "Trend display (up / down / flat). Convention: increase = rose, decrease = green.",
    test: (n) => n.startsWith("delta-"),
  },
  {
    key: "progress",
    label: "Progress",
    desc: "Progress-bar track and fill, plus per-status fills.",
    test: (n) => n.startsWith("progress-"),
  },
];

const sectionOf = (name: string): Section | undefined =>
  SECTIONS.find((s) => s.test(bareName(name)));

// Within a section: solid base → foreground → interaction states → surface set.
const SUFFIX_RANK = [
  "",
  "foreground",
  "hover",
  "pressed",
  "surface",
  "surface-foreground",
  "border",
];
function withinSection(a: TokenRow, b: TokenRow): number {
  const an = bareName(a.name);
  const bn = bareName(b.name);
  const suffix = (n: string) => {
    const hit = SUFFIX_RANK.filter((s) => s && n.endsWith(s)).sort(
      (x, y) => y.length - x.length,
    )[0];
    return SUFFIX_RANK.indexOf(hit ?? "");
  };
  const ra = suffix(an);
  const rb = suffix(bn);
  if (ra !== rb) return ra - rb;
  return an.localeCompare(bn);
}

function Swatch({
  name,
  color,
  onDark,
  checkered,
  mapsTo,
}: {
  name: string;
  color: string;
  onDark?: boolean;
  /** Show a checkerboard behind the swatch so translucent colors read. */
  checkered?: boolean;
  /** Primitive this token aliases, e.g. "purple-700". When set, the card shows
      "→ primitive" instead of the resolved hex (the value lives on the primitive). */
  mapsTo?: string;
}) {
  const boxStyle: React.CSSProperties = checkered
    ? {
        backgroundColor: "#fff",
        backgroundImage: `linear-gradient(${color}, ${color}), conic-gradient(#cbd5e1 25%, #0000 0 50%, #cbd5e1 0 75%, #0000 0)`,
        backgroundSize: "100% 100%, 12px 12px",
      }
    : { background: color };
  return (
    <div style={{ display: "flex", flexDirection: "column", width: 72 }}>
      <div
        style={{
          height: 72,
          borderRadius: 8,
          border: "1px solid rgba(128,128,128,0.35)",
          ...boxStyle,
        }}
      />
      <code
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
          marginTop: 6,
          wordBreak: "break-word",
          color: onDark ? "#e5e7eb" : "inherit",
        }}
      >
        {name.replace("--color-", "")}
      </code>
      <span
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          opacity: 0.6,
          color: onDark ? "#e5e7eb" : "inherit",
        }}
      >
        {mapsTo ? `→ ${mapsTo}` : color}
      </span>
    </div>
  );
}

function Gallery({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 12,
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
}

/** A section's swatches in a single gallery, ordered solid → foreground → states → surface set. */
function SectionGallery({
  tokens,
  theme,
}: {
  tokens: TokenRow[];
  theme: "light" | "dark";
}) {
  return (
    <Gallery>
      {[...tokens].sort(withinSection).map((r) => (
        <Swatch
          key={r.name}
          name={r.name}
          color={theme === "dark" ? r.dark : r.light}
          onDark={theme === "dark"}
          mapsTo={theme === "dark" ? r.mapsToDark : r.mapsToLight}
        />
      ))}
    </Gallery>
  );
}

/** Palette scales — primitives, identical across themes, so a single gallery. */
export function PaletteScales() {
  const rows = useTokens();
  if (!rows) return <p>Reading tokens…</p>;
  // Base primitives (black, white) in one gallery.
  const baseRows = BASE_GROUPS.flatMap((group) =>
    rows
      .filter((r) => groupOf(r.name) === group)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
  // Alpha scrims/overlays, shown over a checkerboard so transparency reads.
  const alphaRows = rows
    .filter((r) => groupOf(r.name) === ALPHA_GROUP)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {baseRows.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h3>Base</h3>
          <Gallery>
            {baseRows.map((r) => (
              <Swatch key={r.name} name={r.name} color={r.light} />
            ))}
          </Gallery>
        </section>
      )}
      {alphaRows.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <h3>Alpha</h3>
          <Gallery>
            {alphaRows.map((r) => (
              <Swatch key={r.name} name={r.name} color={r.light} checkered />
            ))}
          </Gallery>
        </section>
      )}
      {SCALE_GROUPS.map((group) => {
        const groupRows = rows
          .filter((r) => groupOf(r.name) === group)
          .sort((a, b) => stepOf(a.name) - stepOf(b.name));
        if (groupRows.length === 0) return null;
        return (
          <section key={group} style={{ marginBottom: 16 }}>
            <h3 style={{ textTransform: "capitalize" }}>{group}</h3>
            <Gallery>
              {groupRows.map((r) => (
                <Swatch key={r.name} name={r.name} color={r.light} />
              ))}
            </Gallery>
          </section>
        );
      })}
    </>
  );
}

/**
 * Semantic tokens — values differ per theme. Follows Storybook's theme toolbar:
 * `light`/`dark` render a single column in that theme; `side-by-side` renders both.
 */
export function SemanticTokens() {
  const selected = useThemeGlobal();
  const rows = useTokens();
  if (!rows) return <p>Reading tokens…</p>;
  // Grouped into explicit sections (neutral chrome → brand roles → status hues →
  // plumbing → decorative). Tokens not matching any section are dropped from the
  // semantic view (primitives are already excluded by PALETTE_GROUPS).
  const semantic = rows.filter(
    (r) => !PALETTE_GROUPS.includes(groupOf(r.name)),
  );
  const sections = SECTIONS.map((s) => ({
    section: s,
    tokens: semantic.filter((r) => sectionOf(r.name)?.key === s.key),
  })).filter((g) => g.tokens.length > 0);

  const themeView = (theme: "light" | "dark") => {
    // Explicit fg — the docs theme styles headings/paragraphs with a fixed dark
    // color that would otherwise override the dark panel's inherited light text.
    const fg = theme === "dark" ? "#e5e7eb" : "inherit";
    return (
      <div
        data-theme={theme}
        style={{
          flex: 1,
          minWidth: 0,
          // Match vertical padding so columns align at the top in side-by-side;
          // only the tinted dark panel gets horizontal inset (light stays flush-left).
          padding: theme === "dark" ? "12px 16px" : "12px 0",
          borderRadius: 8,
          background: theme === "dark" ? "#0f172a" : "transparent",
          color: fg,
        }}
      >
        {selected === "side-by-side" && (
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: fg,
            }}
          >
            {theme}
          </p>
        )}
        {sections.map(({ section, tokens }) => (
          <section key={section.key} style={{ marginBottom: 8 }}>
            <h4 style={{ margin: "12px 0 0", color: fg }}>{section.label}</h4>
            <p
              style={{
                fontSize: 12,
                opacity: 0.7,
                margin: "2px 0 0",
                maxWidth: 560,
                color: fg,
              }}
            >
              {section.desc}
            </p>
            <SectionGallery tokens={tokens} theme={theme} />
          </section>
        ))}
      </div>
    );
  };

  if (selected === "side-by-side") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        {themeView("light")}
        {themeView("dark")}
      </div>
    );
  }
  return themeView(selected === "dark" ? "dark" : "light");
}
