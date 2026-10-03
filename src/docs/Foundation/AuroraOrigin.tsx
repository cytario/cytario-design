import type { ReactNode } from "react";

/**
 * The brand origin story: cytario's palette is anchored in the polar aurora —
 * purple dusk and teal aurora, the two things that naturally co-occur in that
 * phenomenon. The teal is deliberately brighter, almost arctic ice, so it
 * stands out against the dusk. Renders as a two-panel hero; the panels are
 * fixed imagery (they don't follow the theme toolbar — the photos are the
 * reference), while captions and frame use semantic tokens.
 *
 * Image credits (see Colors.mdx for the full attribution):
 * - dusk.jpg — Quang Le, Hanoi/Vietnam
 * - aurora.jpg — Noel Bauza, nature photographer, France —
 *   https://www.noel-bauza-visual.com
 */
export function AuroraOrigin() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
        marginTop: 24,
      }}
    >
      <figure
        style={{
          margin: 0,
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background: "var(--color-card)",
        }}
      >
        <img
          src="foundation/dusk.jpg"
          alt="Purple dusk sky — the deep violet horizon the neutral ramp and dark canvas are drawn from"
          style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
        />
        <figcaption style={{ padding: "12px 16px" }}>
          <strong style={{ color: "var(--color-foreground)" }}>Dusk</strong>
          <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--color-muted-foreground)" }}>
            The neutral ramp and the dark canvas: deep violet horizons, the
            quiet half of the pair. <em>Photo: Quang Le, Hanoi/Vietnam</em>
          </span>
        </figcaption>
      </figure>
      <figure
        style={{
          margin: 0,
          borderRadius: "var(--border-radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          background: "var(--color-card)",
        }}
      >
        <img
          src="foundation/aurora.jpg"
          alt="Teal aurora over the arctic — the bright, icy accent hue that stands out against the dusk"
          style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
        />
        <figcaption style={{ padding: "12px 16px" }}>
          <strong style={{ color: "var(--color-foreground)" }}>Aurora</strong>
          <span style={{ display: "block", marginTop: 4, fontSize: 13, color: "var(--color-muted-foreground)" }}>
            The interactive accent: deliberately brighter, almost arctic ice,
            so it cuts through the dusk. <em>Photo: Noel Bauza, France —{" "}
            <a href="https://www.noel-bauza-visual.com" rel="noopener noreferrer" target="_blank">noel-bauza-visual.com</a></em>
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

/** Small helper so MDX pages can wrap section prose consistently. */
export function DocsNote({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: 14, color: "var(--color-muted-foreground)" }}>{children}</p>
  );
}
