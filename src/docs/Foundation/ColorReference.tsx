import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";

/**
 * Live color-token reference. Reads every `--color-*` custom property straight
 * from the loaded token stylesheets (`variables.css` = `:root`,
 * `variables-dark.css` = `[data-theme="dark"]`) and resolves each under both
 * themes. Nothing is hardcoded, so this view cannot drift from the tokens.
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
const SCALE_GROUPS = ["slate", "rose", "amber", "green", "teal", "blue", "purple"];
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
function collectDeclaredTokens(): { light: Map<string, string>; dark: Map<string, string> } {
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
      const g = new URLSearchParams(window.location.search).get("globals") ?? "";
      const entry = g.split(";").map((s) => s.split(":")).find(([k]) => k === "theme");
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

// Semantic family order: neutral chrome → identity/interaction → feedback → plumbing.
const FAMILY_ORDER = [
  "brand",
  "surface",
  "text",
  "border",
  "action",
  "status",
  "banner",
  "badge",
  "delta",
  "progress",
  "overlay",
];
const rankIn = (order: string[], value: string) => {
  const i = order.findIndex((p) => value.startsWith(p));
  return i < 0 ? order.length : i;
};

// Within a family: neutral ramp → interaction states → semantic hues.
const VARIANT_ORDER = [
  "default",
  "subtle",
  "muted",
  "strong",
  "primary",
  "secondary",
  "tertiary",
  "inverse",
  "brand",
  "accent",
  "focus",
  "ring",
  "hover",
  "pressed",
  "active",
  "selected",
  "danger",
  "success",
  "warning",
  "info",
  "overlay",
  "backdrop",
  "track",
  "fill",
];
/** One-line purpose per semantic family, shown under its heading. */
const FAMILY_DESC: Record<string, string> = {
  surface:
    "Background fills. default / subtle / muted are the neutral elevation ramp; hover / pressed / selected are interaction states; hue variants tint backgrounds for inline messaging.",
  text: "Foreground / type color. primary / secondary / tertiary is the neutral hierarchy; inverse is for text on dark or colored fills; hue variants carry meaning.",
  border:
    "Dividers, outlines, and the focus ring. Mirrors the surface/text roles so a field can pair border + surface + text of the same hue.",
  brand: "cytario identity — purple primary, teal accent. Use sparingly so emphasis stays meaningful.",
  action:
    "Interactive element fills (buttons, controls). Variants encode role (primary / secondary / danger…) and state (hover / active). For things the user clicks — not status display.",
  status: "State indicators for dots, chips, and icons, where the color itself is the message.",
  banner: "Pre-composed background + text + border + icon sets for full-width alerts. Use a matched set together.",
  badge: "Compact label colors keyed by palette hue (decorative), as background + text pairs.",
  delta: "Trend display (up / down / flat). Convention: increase = rose, decrease = green.",
  progress: "Progress-bar track and fill, plus per-status fills.",
  overlay: "Scrims — the modal/dropdown overlay and the backdrop behind dialogs.",
};

/** Variant part after the family, e.g. "action-primary-hover" → "primary-hover". */
const variantOf = (name: string) => name.replace("--color-", "").split("-").slice(1).join("-");
function semanticSort(a: TokenRow, b: TokenRow): number {
  const fa = FAMILY_ORDER.indexOf(groupOf(a.name));
  const fb = FAMILY_ORDER.indexOf(groupOf(b.name));
  if (fa !== fb) return (fa < 0 ? 999 : fa) - (fb < 0 ? 999 : fb);
  const va = variantOf(a.name);
  const vb = variantOf(b.name);
  const ra = rankIn(VARIANT_ORDER, va);
  const rb = rankIn(VARIANT_ORDER, vb);
  if (ra !== rb) return ra - rb;
  return va.localeCompare(vb); // base before its hover/active variants
}

// Sub-clusters inside a family, separated visually. Order matters.
const SUBGROUP_ORDER = ["base", "selection", "brand", "status", "overlay"] as const;
function subgroupOf(variant: string): (typeof SUBGROUP_ORDER)[number] {
  const v = variant.toLowerCase();
  if (/^(danger|success|warning|info)/.test(v)) return "status";
  if (v.startsWith("selected")) return "selection";
  if (v === "brand" || v === "accent" || v.startsWith("brand") || v.startsWith("accent"))
    return "brand";
  if (v.startsWith("overlay") || v.startsWith("backdrop")) return "overlay";
  return "base"; // neutral ramp + interaction states
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

/** A family's swatches, split into sub-clusters separated by a full-width rule. */
function FamilyGallery({ tokens, theme }: { tokens: TokenRow[]; theme: "light" | "dark" }) {
  const buckets = SUBGROUP_ORDER.map((cat) => ({
    cat,
    items: tokens.filter((t) => subgroupOf(variantOf(t.name)) === cat),
  })).filter((b) => b.items.length > 0);

  const children: React.ReactNode[] = [];
  buckets.forEach((b, i) => {
    if (i > 0) {
      children.push(
        <div
          key={`sep-${b.cat}`}
          style={{
            flexBasis: "100%",
            height: 0,
            borderTop: "1px dashed rgba(128,128,128,0.3)",
            margin: "4px 0",
          }}
        />,
      );
    }
    for (const r of b.items) {
      children.push(
        <Swatch
          key={r.name}
          name={r.name}
          color={theme === "dark" ? r.dark : r.light}
          onDark={theme === "dark"}
          mapsTo={theme === "dark" ? r.mapsToDark : r.mapsToLight}
        />,
      );
    }
  });
  return <Gallery>{children}</Gallery>;
}

/** Palette scales — primitives, identical across themes, so a single gallery. */
export function PaletteScales() {
  const rows = useTokens();
  if (!rows) return <p>Reading tokens…</p>;
  // Base primitives (black, white) in one gallery.
  const baseRows = BASE_GROUPS.flatMap((group) =>
    rows.filter((r) => groupOf(r.name) === group).sort((a, b) => a.name.localeCompare(b.name)),
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
  // Sorted by family (chrome → interaction → feedback → plumbing) then by
  // variant (neutral ramp → states → hues); groups inherit that order.
  const semantic = rows
    .filter((r) => !PALETTE_GROUPS.includes(groupOf(r.name)))
    .sort(semanticSort);
  const groups = Array.from(new Set(semantic.map((r) => groupOf(r.name))));

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
      {groups.map((group) => (
        <section key={group} style={{ marginBottom: 8 }}>
          <h4 style={{ textTransform: "capitalize", margin: "12px 0 0", color: fg }}>
            {group}
          </h4>
          {FAMILY_DESC[group] && (
            <p style={{ fontSize: 12, opacity: 0.7, margin: "2px 0 0", maxWidth: 560, color: fg }}>
              {FAMILY_DESC[group]}
            </p>
          )}
          <FamilyGallery
            tokens={semantic.filter((r) => groupOf(r.name) === group)}
            theme={theme}
          />
        </section>
      ))}
    </div>
    );
  };

  if (selected === "side-by-side") {
    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
        {themeView("light")}
        {themeView("dark")}
      </div>
    );
  }
  return themeView(selected === "dark" ? "dark" : "light");
}
