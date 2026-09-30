import { useEffect, useState } from "react";
import { addons } from "storybook/preview-api";
import { TOKEN_CATALOG, type TokenRow } from "./token-catalog.generated";

/**
 * Live color-token reference. Renders the build-time token catalog — generated
 * from `theme.css` (the same source Tailwind compiles) by
 * `scripts/generate-token-catalog.ts`, refreshed on every dev/build start, so
 * this view cannot drift from the tokens.
 */

// Stepped hue scales, each its own gallery.
// slate (neutral) first, then hue scales by wavelength: red → violet.
const SCALE_GROUPS = [
  "slate",
  "rose",
  "amber",
  "green",
  "teal",
  "blue",
];
// Base primitives (black + white), shown atop the scales.
const BASE_GROUPS = ["black", "white"];
// Alpha scrims/overlays — their own gallery (rendered over a checkerboard).
const ALPHA_GROUP = "alpha";
// Everything primitive — excluded from the Semantic section.
const PALETTE_GROUPS = [...SCALE_GROUPS, ...BASE_GROUPS, ALPHA_GROUP];

/** Static catalog from the generated module (sorted by token name). */
const rows: TokenRow[] = TOKEN_CATALOG;

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
    key: "progress",
    label: "Progress",
    desc: "Progress-bar track and fill, plus per-status fills.",
    test: (n) => n.startsWith("progress-"),
  },
  {
    key: "other",
    label: "Other",
    desc: "Semantic tokens not covered by a section above (dark-mode surfaces, ink/hairline ramp, links, selection, …). If a token lands here, consider giving it a proper section.",
    test: () => true,
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

/**
 * Primitive swatch — vertical: color box on top, name + resolved hex below.
 * `checkered` draws the transparency grid so translucent tokens (scrims) read.
 * The token color itself is runtime data, so it stays an inline style; Tailwind
 * cannot emit classnames for values it cannot see at build time.
 */
function ColorSwatchPrimitive({
  name,
  color,
  checkered,
}: {
  name: string;
  color: string;
  checkered?: boolean;
}) {
  return (
    <div className="flex w-18 flex-col">
      <div
        className={`h-18 overflow-hidden rounded-lg border border-[rgba(128,128,128,0.35)] ${
          checkered
            ? "bg-[length:12px_12px] bg-[conic-gradient(#cbd5e1_25%,#fff_0_50%,#cbd5e1_0_75%,#fff_0)]"
            : ""
        }`}
      >
        <div className="h-full w-full" style={{ background: color }} />
      </div>
      <code className="mt-1.5 font-mono text-[11px] break-words">
        {name.replace("--color-", "")}
      </code>
      <span className="font-mono text-[10px] opacity-60">{color}</span>
    </div>
  );
}

/**
 * Semantic swatch — horizontal: color box on the left, name and the primitive
 * it maps to on the right, giving long property-agnostic names room to wrap.
 */
function ColorSwatchSemantic({
  name,
  color,
  mapsTo,
}: {
  name: string;
  color: string;
  mapsTo?: string;
}) {
  return (
    <div className="flex w-full items-start gap-2.5">
      <div
        className="h-8 w-8 shrink-0 rounded-sm border border-[rgba(128,128,128,0.35)]"
        style={{ background: color }}
      />
      <div className="min-w-0">
        <code className="cr-swatch-name font-mono text-xs! wrap-break-word">
          {name.replace("--color-", "")}
        </code>
        <span className="cr-swatch-value block font-mono text-xs! opacity-60">
          {mapsTo ? `→ ${mapsTo}` : color}
        </span>
      </div>
    </div>
  );
}

function Gallery({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 mb-6 flex flex-wrap gap-4">{children}</div>;
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
        <ColorSwatchSemantic
          key={r.name}
          name={r.name}
          color={theme === "dark" ? r.dark : r.light}
          mapsTo={theme === "dark" ? r.mapsToDark : r.mapsToLight}
        />
      ))}
    </Gallery>
  );
}

/** Palette scales — primitives, identical across themes, so a single gallery. */
export function PaletteScales() {
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
        <section className="mb-4">
          <h3>Base</h3>
          <Gallery>
            {baseRows.map((r) => (
              <ColorSwatchPrimitive
                key={r.name}
                name={r.name}
                color={r.light}
              />
            ))}
          </Gallery>
        </section>
      )}
      {alphaRows.length > 0 && (
        <section className="mb-4">
          <h3>Alpha</h3>
          <Gallery>
            {alphaRows.map((r) => (
              <ColorSwatchPrimitive
                key={r.name}
                name={r.name}
                color={r.light}
                checkered
              />
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
          <section key={group} className="mb-4">
            <h3 className="capitalize">{group}</h3>
            <Gallery>
              {groupRows.map((r) => (
                <ColorSwatchPrimitive
                  key={r.name}
                  name={r.name}
                  color={r.light}
                />
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
  // Grouped into explicit sections (neutral chrome → brand roles → status hues →
  // plumbing → decorative). Tokens not matching any section land in the
  // "Other" catch-all at the end.
  const semantic = rows.filter(
    (r) => !PALETTE_GROUPS.includes(groupOf(r.name)),
  );
  const sections = SECTIONS.map((s) => ({
    section: s,
    tokens: semantic.filter((r) => sectionOf(r.name)?.key === s.key),
  })).filter((g) => g.tokens.length > 0);

  // Storybook's docs theme pins font-size and color directly on headings,
  // paragraphs, and code (unlayered CSS) — plain Tailwind utilities lose to
  // it. These rules re-assert the panel's own typography and make the dark
  // column's text follow the semantic foreground token.
  const themeCss = `
    .cr-panel :where(p) { font-size: 12px !important; }
    .cr-panel[data-theme="dark"] :where(h4, p, code, span) {
      color: var(--color-foreground) !important;
    }
  `;

  const themeView = (theme: "light" | "dark") => (
    <div
      data-theme={theme}
      className={`cr-panel min-w-0 flex-1 rounded-lg py-3 ${
        // Match vertical padding so columns align at the top in side-by-side;
        // only the tinted dark panel gets horizontal inset (light stays flush-left).
        theme === "dark" ? "bg-background px-4" : ""
      }`}
    >
      {selected === "side-by-side" && (
        <p className="text-xs font-bold tracking-wider uppercase">{theme}</p>
      )}
      {sections.map(({ section, tokens }) => (
        <section key={section.key} className="mb-2">
          <h4 className="mt-3">{section.label}</h4>
          <p className="mt-0.5 max-w-140 text-xs opacity-70">{section.desc}</p>
          <SectionGallery tokens={tokens} theme={theme} />
        </section>
      ))}
    </div>
  );

  return (
    <>
      <style>{themeCss}</style>
      {selected === "side-by-side" ? (
        <div className="flex flex-row items-start gap-4">
          {themeView("light")}
          {themeView("dark")}
        </div>
      ) : (
        themeView(selected === "dark" ? "dark" : "light")
      )}
    </>
  );
}
