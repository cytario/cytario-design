# AGENTS.md

The **cytario design system** — the single source of truth for the cytario
corporate identity. It covers brand foundation (logos, colors, typography) and
production-ready React UI components (`@cytario/design`), served as an
interactive Storybook portal. cytario is a digital pathology / spatial biology
company; the design system serves developers, designers, marketing, and
regulatory affairs.

The portal is **dark-first**: dark is the default theme (`initialGlobals` in
`.storybook/preview.ts`, manager chrome in `.storybook/manager.ts`), and every
surface — story canvas, docs pages, manager chrome — runs on the dusk ramp.
Light mode is fully supported and pixel-stable, but it is the secondary target.

## Tech stack

- **Storybook 10** (with MDX documentation pages, addon-a11y, addon-docs)
- **React 18 + 19** + **TypeScript 5.9** (strict mode) — components support React 18 and 19; CI tests against both via matrix
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, `@theme` block in `src/styles/tailwind.css`)
- **React Aria Components** (Adobe) — headless accessible primitives for all interactive components
- **Vitest** + **React Testing Library** for component tests
- **Design tokens** in `src/styles/theme.css` — single hand-maintained CSS: primitives (raw hex in `:root`), light semantics (`:root` with `var()`), dark overrides (`[data-theme="dark"]`), and `@theme inline` for Tailwind v4. `npm run validate:tokens` gates dark parity, WCAG AA contrast pairs, **and dusk-ramp drift** (see below).

## Project structure

```
.storybook/           # Storybook config (main.ts, preview.ts, theme.ts, manager.ts)
  assets/
    logos/              # SVGO-optimized SVG logo variants + PNGs
    foundation/         # Aurora-origin reference photography (dusk/aurora; credit lines in Colors.mdx)
    approvals/          # Agency approval PDFs (reference only)
scripts/
  validate-tokens.ts  # CI gate: dark parity + WCAG pairs + dusk-ramp drift
  generate-token-catalog.ts  # Builds the docs Colors page catalog on every dev/build
  lib/
    token-catalog.ts   # Source parser shared by the gate and the docs catalog
    dusk-ramp.ts       # SOURCE OF TRUTH for the dusk ramp (OKLCH parameter table)
src/
  styles/
    theme.css          # Primitives (:root), light + dark semantics, @theme inline
    tailwind.css      # Imports theme.css; Tailwind v4 entry point
  components/         # React components (co-located: .tsx + .stories.tsx + .test.tsx)
    Button/           # text button; variants from _shared/styles
    Form/             # form controls — Input, InputPassword, Select, Checkbox, Radio, …
    Table/            # Sortable data table, compact/comfortable sizes
    _shared/          # shared style builders (variantStyles, sizeStyles)
    _composites/      # multi-component demo stories (AuthScreens, …)
  docs/               # MDX documentation pages
    Introduction.mdx
    Foundation/       # Logo, Colors, Typography, Spacing, Icons
```

## Commands

```bash
npm install
npm run validate:tokens     # Dark parity + WCAG AA contrast pairs + dusk drift gate
npm run generate:tokens     # Regenerate the docs token catalog (also runs on predev/prebuild)
npm run dev                  # Start Storybook at http://localhost:6006 (dark theme default)
npm run build                # Build static Storybook to storybook-static/
npx vitest run        # Run all tests once (use --maxWorkers=2 if the machine is loaded — Table tests can time out under full parallelism)
npm run lint                 # ESLint on src/
```

## Brand colors — the aurora story

The palette is anchored in the **polar aurora** — the two things that naturally
co-occur in that phenomenon:

- **Purple dusk** — the quiet half. The neutral ramp (`dusk-*`, the tinted
  successor of Tailwind's slate) and the dark canvas are drawn from deep violet
  horizons. `dusk-900` **is** the brand canvas `#160a24`.
- **Teal aurora** — deliberately brighter, almost arctic ice, so it stands out
  against the dusk and carries every interactive accent (`ring`, links,
  secondary).

Token anchors: purple-700 `#5c2483` (light primary), teal scale with
teal-300/teal-700 split per theme. Both have full 50-950 scales in
`src/styles/theme.css`. Reference photography (with credit lines) lives in
`assets/foundation/` and must not leave the documentation.

### Dark-mode ink ladder

Text on the dusk-900 canvas follows a deliberate anti-halation hierarchy:

| Tier | Token | Value | On canvas |
|---|---|---|---|
| body | `--color-foreground` | dusk-200 | 15.4:1 |
| muted | `--color-muted-foreground` | dusk-300 | 12.7:1 |
| surfaces | `--color-muted` / `card` | dusk-600 / dusk-800 | 2.0 / 1.1:1 |

Do **not** use dusk-100 as body ink (halation) and do not brighten past
dusk-200 for large surfaces of text.

## Design token pipeline

Design tokens live in a single hand-maintained file: `src/styles/theme.css`.
The CSS is the source of truth for everything except the dusk ramp (below).

- **Primitives** (`:root`): raw hex/rgba values for color scales, spacing, typography (`--color-purple-500`)
- **Semantic light** (`:root`): `var()` references to primitives (`--color-primary: var(--color-purple-500)`)
- **Semantic dark** (`[data-theme="dark"]`): overrides for every semantic token
- **`@theme inline`**: maps tokens to Tailwind v4 utility names (`--color-primary → primary`)

The entire block lives in `@layer cytario-design` so consumer app styles (unlayered) can always override.

### The dusk ramp is generated — never hand-edit a dusk hex

The `dusk-*` neutral ramp sits on a single OKLCH line (hue 299, the brand
purple). Its **source of truth is the parameter table in
`scripts/lib/dusk-ramp.ts`** (per-step L/C/H, recovered from the deployed
palette — byte-stable roundtrip). The checked-in hex values are gated by
`npm run validate:tokens`, which fails if any dusk value disagrees with the
table or drifts off the line. **Change the ramp by changing the parameter
table, then regenerate the hex; never edit a `--color-dusk-*` value directly.**

### Token rules the relaunch established

1. **Pair text/icons with the surface token family.** Solid fill tokens
   (`primary`, `success`, `destructive`, `info`, `warning`, `accent`) are
   **fills** — their `-foreground` tokens are the inks that belong on them.
   On *tinted surfaces* (`{variant}-surface`), the ink is
   `{variant}-surface-foreground`. Using a fill token as text on a tinted
   surface is the most recurring contrast bug in this repo (Menu check icons,
   Toast, Banner icons, SegmentedControl labels — all fixed; don't reintroduce
   it).
2. **Dark hover/pressed step LIGHTER than rest** on quiet surfaces
   (`muted 600 → accent 500 → pressed 700`; pressed is the deepest state).
   A darker hover on a dark surface is an invisible state change. Mid-tone
   fills (primary, status variants, accent) take a **white label**, not
   dusk-200.
3. **Light mode stays pixel-stable by construction**: border tokens equal
   their fills in light (`primary-border: #5c2483` on the same fill), so
   adding a border is invisible there; dark overrides them to a lighter rim
   (`+200` ramp steps: purple-300, rose-400, green-500…) for dimensionality.
   Rim tokens carry the `-rim` suffix; the darker `-border` tokens are for
   banner-surface insets and error outlines — do not repoint them.
4. **Dark secondary is an outline treatment**: transparent fill, teal-300
   text, teal-500 border, teal washes (12%/20% alpha) for hover/pressed.

### Adding or modifying tokens

1. Edit `src/styles/theme.css` directly (dusk ramp: see above).
2. Add entries in all four sections (primitives, light semantics, dark semantics, `@theme inline`) — plus `src/styles/tokens.css` for exported token maps.
3. Run `npm run validate:tokens` — it checks dark parity, WCAG AA pairs, and dusk drift.

**No auto-rebuild needed.** CSS imports are static — Storybook and the published library pick up changes immediately on reload. The docs token catalog regenerates on `npm run dev`/`build` (`predev`/`prebuild` hooks) — start the server with `npm run dev`, **not** `npx storybook dev`, or the Colors page 404s on its generated catalog.

## Theme mechanics (the gotchas)

- **Theming is `data-theme` on `<html>`** (set by the Storybook decorator /
  docs container). The dark block `[data-theme="dark"]` in theme.css applies to
  any element carrying the attribute — custom properties re-scope per element.
- **Fixed-background demo surfaces must declare their `data-theme`.** A demo
  panel with a hardcoded light/dark background whose theme comes from the page
  will render page-theme ink on the wrong surface (white-on-white /
  dark-on-dark). Every fixed demo panel in stories and MDX carries its
  `data-theme` attribute (see Logo stories, Prose invert demo). When a theme
  bug appears in a demo, check this first.
- **Portaled overlays escape themed containers.** React-Aria portals popovers
  to `document.body`; the Tooltip portals itself. `useTriggerTheme`
  (`src/components/Popover/useTriggerTheme.tsx`) captures the trigger's themed
  DOM context via a callback ref and exposes the value; overlay components
  (Menu, Popover, Select, Tooltip, useContextMenu) stamp it as `data-theme`
  on the portaled element. New overlay components must do the same.
- **MDX pages**: JSX text nodes stay **inline** in their tags. Multi-line text
  inside a JSX `<p>` makes MDX wrap it in a markdown paragraph — duplicated
  content, `<p>`-in-`<p>`, and (in dark mode) the inner copy renders
  invisible ink on light panels. This bit the Introduction, Typography, and
  Prose pages; fix it by keeping the text on one line.
- **Side-by-side view**: the side-by-side panels set `color:
  var(--color-foreground)` in addition to their background — inherited text
  colors arrive as *resolved values* from the (light) page root and would
  otherwise paint dark ink on the dark panel.

## Component architecture

All components follow the same pattern:

1. **Behavior + accessibility**: Wrap a React Aria Component (e.g., `Button`, `TextField`, `Select`, `Table`). **Exception**: `InputPassword` intentionally renders a ref-forwarded native `<input>` (not RAC `TextField`) so it works in server-driven native forms — the cytario-keycloak Keycloakify login theme re-uses it and depends on native DOM events + native form submission. Do not "upgrade" it to RAC.
2. **Styling**: Tailwind v4 canonical utility classes. Use standard utilities where they exist (`font-semibold`, `text-sm`, `gap-4`, `rounded-md`), including the semantic color utilities generated from the design tokens (`bg-primary`, `text-muted-foreground`, `bg-destructive`, `border-border`). Use arbitrary token syntax (`bg-(--color-badge-purple-bg)`) only for the decorative `badge`/`delta`/`progress` palettes that are deliberately excluded from the `@theme` layer. Never use verbose forms like `[var(--spacing-4)]` or `(number:--font-weight-semibold)`.
3. **Stories**: CSF3 format, import from `storybook/react` and `storybook/test` (Storybook 10 paths)
4. **Tests**: Vitest + React Testing Library. Test by user perspective (query by role/label). Do not test React Aria internals.

### Storybook 10 import paths

These are different from Storybook 8:

- Stories: `import type { Meta, StoryObj } from "storybook/react"`
- Test utilities: `import { expect, fn, userEvent, within } from "storybook/test"`
- MDX blocks: `import { Meta } from "@storybook/addon-docs/blocks"`
- Theme: `import { create } from "storybook/theming/create"`
- Manager API: `import { addons } from "storybook/manager-api"`

Packages consolidated into `storybook` core (do NOT install separately): `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/blocks`, `@storybook/test`.

## Storybook configuration notes

- **Tailwind**: `@tailwindcss/vite` is registered via `viteFinal` in `.storybook/main.ts` — this is required for Tailwind to work in Storybook
- **MDX tables**: `remark-gfm` is configured in addon-docs options to enable GFM markdown table syntax in MDX files
- **Theme**: `.storybook/theme.ts` carries a light and a dark theme, both built on the dusk ramp (dark: appBg dusk-950, content/preview dusk-900 the brand canvas, bar dusk-800; light theme unchanged). The manager starts dark and follows the toolbar global. Onboarding checklist and what's-new notifications are disabled (`features.sidebarOnboardingChecklist: false`, `core.disableWhatsNewNotifications: true`) — this is a published portal for consumers, not a Storybook onboarding surface.
- **Docs pages follow the Theme toolbar** via `DocsThemeContainer` in `.storybook/preview.ts` (wraps the default `DocsContainer`; reads the toolbar global from the iframe URL + `GLOBALS_UPDATED` events — the docs context has no `globals` field).
- **Static assets**: `assets/` directory is served via `staticDirs` config — reference logos as `logos/cytario-logo-purple.svg` and foundation photos as `foundation/dusk.jpg` in MDX

## Story house style

Stories are CSF3 and exist to document a component, not to enumerate every prop value. Keep them lean — **a story earns its slot only if it shows a prop, state, or combination not already visible elsewhere.**

- **Title**: `Components/<Name>`, or `Components/Form/<Name>` for form controls. Co-locate `<Name>.stories.tsx` with the component.
- **Lead with the overview grid.** First export is `AllVariants` (or `AllSizes`) — a labeled CSS grid: rows = variant, columns = size, axis labels in `var(--color-muted-foreground)`. This is the canonical visual reference.
- **No slop.** Because the grid already shows every variant × size, do **not** add per-variant or per-size stories — they are pure duplication. Likewise never add label-only stories (same component, different `children`/`href` text) that exercise no new prop. This is the single most common bloat; a typical component needs ~6–8 stories, not 30.
- **Then**: `Playground` (every control wired via `args` + `argTypes`), followed by the few stories the grid can't express (icons, loading, disabled, error, description…), and finally one `*Interaction` play test (`storybook/test`).
- **Sidebar order** is pinned via `options.storySort` in `.storybook/preview.ts`. Within a single file, story order = export order (no `storySort.method`, so don't rely on alphabetical).
- **Real-world demos** that compose several components belong in `_composites/` stories, not as variations on a primitive's story file.
- **Dark-theme features**: the glow (rotating conic-gradient edge) and SegmentedControl glide (CSS anchor positioning) stories render on explicit `bg-dusk-900` demo canvases — they carry `data-theme="dark"` per the fixed-surface rule.

## Verifying color work

When touching tokens or component colors, **measure, don't eyeball** — culori
(`wcagContrast`) for ratios in both themes, and the browser for computed
styles. Known-good anchors: body ink 15.4:1 on canvas; toast/banner surface
inks 5.2–10.3:1; button rims 1.5–2.5:1 boundary (subordinate to the label).
`npm run validate:tokens` gates the pairs; add new semantic pairs there when
adding tokens. Prefer fixing a **token** (or a component's token pairing)
over adding new colors — the ramp is fenced and the token count is a budget.

## Regulatory context

cytario operates in the medical device space (digital pathology). Key implications:

- **SOUP (IEC 62304)**: Runtime dependencies (react, react-aria-components) are SOUP when consumed in the medical device. Dev dependencies (storybook, vitest) are not.
- **Claims governance**: the marketing-claims doc was removed in the C-613 overhaul. EU MDR Article 7 still treats advertising as labeling — claims must map to regulatory submissions. Recover the content from git history before making marketing claims.
- **Accessibility**: WCAG 2.2 AA is required. Every component must pass addon-a11y (axe-core) checks.

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml`:

- **test** job: runs on all pushes/PRs to main/master — matrix tests against React 18 and React 19 (installs, builds tokens, tests, builds Storybook)
- **deploy** job: runs on push to main only — publishes `storybook-static/` to GitHub Pages

## Agents

Four specialized agents are configured in `.claude/agents/`:

- **cmo** — brand governance, marketing claims, regulatory compliance
- **graphics-designer** — visual design, design tokens, asset management, SVG optimization
- **ux-designer** — interaction patterns, component behavior, MDX documentation, portal UX
- **frontend-engineer** — component implementation, tooling, testing, token pipeline, SOUP assessment

When building new components, use the frontend-engineer agent. For brand/visual decisions, consult graphics-designer. For interaction patterns, consult ux-designer. For claims or regulatory content, consult cmo.

## Worktrees

Create git worktrees as **sibling directories** of the main checkout, e.g.
`~/src/cytario-design-c-476` next to `~/src/cytario-design` (repo name,
hyphen, branch suffix). **Never** create `wt/` (or any worktree-collecting)
folder *inside* a repository — it pollutes builds, globs, and tooling that
walks the source tree:

```bash
git -C ~/src/cytario-design worktree add ../cytario-design-<suffix> -b <branch> origin/main
```

Also never place worktrees in `/tmp` — they don't survive workspace restarts;
keep them on the persistent home volume.

## Comments

- Default to **no comments**. Well-named identifiers carry the meaning. Only
  add a comment when the _why_ is non-obvious (a hidden constraint, a subtle
  invariant, a workaround for a specific bug, behavior that would surprise a
  reader).
- Keep it to one short line. Never restate what the code says, never
  multi-paragraph commentary. (Exception: `theme.css` carries measured WCAG
  ratios and provenance in block comments — contrast decisions are the _why_
  and belong there.)
- **No ticket IDs** (`C-123`, `WEB-344`) and **no requirement IDs**
  (`SRS-CY-…`) in comments or identifiers — they rot; that context belongs
  in the commit message's `Refs:` footer and the PR description.
- No history in comments ("originally", "added for", "before the fix") —
  `git blame` is for that.

## Git & pull requests

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`;
  `BREAKING CHANGE:` footer or `!` triggers a major bump) — semantic-release
  versions, changelogs, and npm publishing from the commit history on `main`.
- **Always run `npx vitest run` before committing** — component tests assert
  on class names, so any Tailwind class refactoring must update the tests too.
- Title **starts with the Plane ticket ID**, then the Conventional-Commit
  summary. Only the PR that actually **closes** the ticket carries the
  ticket in **square brackets** (`[C-476] fix(table): selectable grouped
  rows`) — Plane transitions the item to Done on merge. All other PRs in
  the chain — the related and follow-up ones — lead with parentheses or
  bare IDs (`(C-476) fix(table): …`) so those tickets stay open. Follow
  the SDLC (cytario-docs handbook `engineering/sdlc.md` §6.6).

## Common pitfalls

- Do not install `@storybook/addon-essentials`, `@storybook/blocks`, or `@storybook/test` as separate packages — they are part of `storybook` core in v10
- Do not import any font-face from a CDN — `@font-face` declarations live in `src/styles/theme.css`
- Always use conventional commit format — semantic-release depends on it for versioning
- Storybook sidebar icon colors are controlled via CSS in `.storybook/manager-head.html`, not via the theme API
- Never hand-edit a `--color-dusk-*` value — the OKLCH table in `scripts/lib/dusk-ramp.ts` is the source of truth and the validator will fail the build
- Never use a solid fill token (`text-primary`, `text-success`, …) as text or icon color on a tinted `-surface` — use `-{variant}-surface-foreground`
- Start Storybook with `npm run dev` (regenerates the token catalog); `npx storybook dev` leaves the Colors page 404ing
