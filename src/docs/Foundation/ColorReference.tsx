import { useEffect, useState } from "react";

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
}

const PALETTE_GROUPS = ["slate", "purple", "teal", "rose", "green", "amber"];

function rgbToHex(rgb: string): string {
  // Preserve alpha colors (scrims) verbatim — they read better as rgba.
  if (rgb.startsWith("rgba") && !/,\s*1\)$/.test(rgb)) return rgb;
  const m = rgb.match(/[\d.]+/g);
  if (!m) return rgb;
  const [r, g, b] = m.map(Number);
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function collectDeclaredTokens() {
  const names = new Set<string>();

  // Token rules live inside `@layer cytario-design { :root { … } }` and may be
  // reached through `@import`, so walk grouping rules and imported sheets too.
  const walk = (rules: CSSRuleList) => {
    for (const rule of Array.from(rules)) {
      if (rule instanceof CSSStyleRule) {
        if (
          rule.selectorText === ":root" ||
          rule.selectorText === '[data-theme="dark"]'
        ) {
          for (const prop of Array.from(rule.style)) {
            if (prop.startsWith("--color-")) names.add(prop);
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
  return Array.from(names);
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
    const names = collectDeclaredTokens().sort();
    const lightHost = makeProbeHost("light");
    const darkHost = makeProbeHost("dark");
    const resolved = names.map((name) => ({
      name,
      light: resolveUnder(lightHost, name),
      dark: resolveUnder(darkHost, name),
    }));
    document.body.removeChild(lightHost);
    document.body.removeChild(darkHost);
    setRows(resolved);
  }, []);
  return rows;
}

function groupOf(name: string): string {
  return name.replace("--color-", "").split("-")[0];
}

function stepOf(name: string): number {
  const last = name.split("-").pop() ?? "";
  return /^\d+$/.test(last) ? Number(last) : Number.POSITIVE_INFINITY;
}

function Swatch({
  name,
  color,
  onDark,
}: {
  name: string;
  color: string;
  onDark?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: 72 }}>
      <div
        style={{
          height: 72,
          borderRadius: 8,
          background: color,
          border: "1px solid rgba(128,128,128,0.35)",
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
        {color}
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

/** Palette scales — primitives, identical across themes, so a single gallery. */
export function PaletteScales() {
  const rows = useTokens();
  if (!rows) return <p>Reading tokens…</p>;
  return (
    <>
      {PALETTE_GROUPS.map((group) => {
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

/** Semantic tokens — values differ per theme, so one gallery each. */
export function SemanticTokens() {
  const rows = useTokens();
  if (!rows) return <p>Reading tokens…</p>;
  const semantic = rows.filter(
    (r) => !PALETTE_GROUPS.includes(groupOf(r.name)),
  );
  const groups = Array.from(
    new Set(semantic.map((r) => groupOf(r.name))),
  ).sort();

  const themeView = (theme: "light" | "dark") => (
    <div
      data-theme={theme}
      style={{
        padding: "12px 16px",
        borderRadius: 8,
        background: theme === "dark" ? "#0f172a" : "transparent",
        color: theme === "dark" ? "#e5e7eb" : "inherit",
      }}
    >
      <p
        style={{
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {theme}
      </p>
      {groups.map((group) => (
        <section key={group} style={{ marginBottom: 8 }}>
          <h4 style={{ textTransform: "capitalize", margin: "12px 0 0" }}>
            {group}
          </h4>
          <Gallery>
            {semantic
              .filter((r) => groupOf(r.name) === group)
              .map((r) => (
                <Swatch
                  key={r.name}
                  name={r.name}
                  color={theme === "dark" ? r.dark : r.light}
                  onDark={theme === "dark"}
                />
              ))}
          </Gallery>
        </section>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {themeView("light")}
      {themeView("dark")}
    </div>
  );
}
