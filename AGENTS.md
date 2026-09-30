# AGENTS.md

The **cytario design system** — the single source of truth for the cytario
corporate identity. It covers brand foundation (logos, colors, typography) and
production-ready React UI components (`@cytario/design`), served as an
interactive Storybook portal. cytario is a digital pathology / spatial biology
company; the design system serves developers, designers, marketing, and
regulatory affairs.

## Tech stack

- **Storybook 10** (with MDX documentation pages, addon-a11y, addon-docs)
- **React 18 + 19** + **TypeScript 5.9** (strict mode) — components support React 18 and 19; CI tests against both via matrix
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, `@theme` block in `src/styles/tailwind.css`)
- **React Aria Components** (Adobe) — headless accessible primitives for all interactive components
- **Vitest** + **React Testing Library** for component tests
- **Design tokens** in `src/styles/theme.css` — single hand-maintained CSS: primitives (raw hex in `:root`), light semantics (`:root` with `var()`), dark overrides (`[data-theme="dark"]`), and `@theme inline` for Tailwind v4. Validate dark-theme invariant with `npm run validate:tokens`.

## Project structure

```
.storybook/           # Storybook config (main.ts, preview.ts, theme.ts, manager.ts)
  assets/
    logos/              # SVGO-optimized SVG logo variants + PNGs
    approvals/          # Agency approval PDFs (reference only)
scripts/
  validate-tokens.ts  # CI script: verifies dark-theme invariant (every :root color has a [data-theme="dark"] override)
src/
  styles/
    theme.css          # Single source-of-truth: primitives (:root), light semantics (:root), dark semantics ([data-theme="dark"]), @theme inline (Tailwind v4)
    tailwind.css      # Imports theme.css; Tailwind v4 entry point
  components/         # React components (co-located: .tsx + .stories.tsx + .test.tsx)
    Button/           # text button; variants from _shared/styles
    Form/             # form controls — Input, InputPassword, Select, Checkbox, Radio, …
    Table/            # Sortable data table, compact/comfortable sizes
    _shared/          # shared style builders (variantStyles, sizeStyles)
    _composites/      # multi-component demo stories (AuthScreens, …)
  docs/               # MDX documentation pages
    Introduction.mdx
    Foundation/       # Logo, Colors, Typography, Spacing
```

## Commands

```bash
npm install
npm run validate:tokens     # Verify dark-theme invariant (every :root color has a [data-theme="dark"] counterpart)
npm run dev                  # Start Storybook at http://localhost:6006
npm run build                # Build static Storybook to storybook-static/
npx vitest run        # Run all tests once
npm run lint                 # ESLint on src/
```

## Brand colors

- **Purple `#5c2483`** — primary brand color (wordmark). Token: `--color-purple-700` / `--color-brand-primary`
- **Teal `#35b7b8`** — accent color (icon, primary actions). Token: `--color-teal-500` / `--color-brand-accent`
- Both have full 50-900 scales in `src/styles/theme.css`
- Teal-500 fails WCAG AA contrast on white for normal text — use teal-700 (`#217d7e`) or darker for text

## Design token pipeline

Design tokens live in a single hand-maintained file: `src/styles/theme.css`. There is no build step — the CSS is the source of truth.

- **Primitives** (`:root`): raw hex/rgba values for color scales, spacing, typography (`--color-purple-500`)
- **Semantic light** (`:root`): `var()` references to primitives (`--color-primary: var(--color-purple-500)`)
- **Semantic dark** (`[data-theme="dark"]`): overrides for every semantic token
- **`@theme inline`**: maps tokens to Tailwind v4 utility names (`--color-primary → primary`)

The entire block lives in `@layer cytario-design` so consumer app styles (unlayered) can always override.

**Adding or modifying tokens:**

1. Edit `src/styles/theme.css` directly.
2. If adding a new color scale, add entries in all four sections (primitives, light semantics, dark semantics, `@theme inline`).
3. Run `npm run validate:tokens` to verify the dark-theme invariant.

**No auto-rebuild needed.** CSS imports are static — Storybook and the published library pick up changes immediately on reload.

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
- **Theme**: Custom cytario theme in `.storybook/theme.ts` uses purple for sidebar/accents. Sidebar icon colors are overridden via CSS in `.storybook/manager-head.html`
- **Static assets**: `assets/` directory is served via `staticDirs` config — reference logos as `logos/cytario-logo-purple.svg` in MDX

## Story house style

Stories are CSF3 and exist to document a component, not to enumerate every prop value. Keep them lean — **a story earns its slot only if it shows a prop, state, or combination not already visible elsewhere.**

- **Title**: `Components/<Name>`, or `Components/Form/<Name>` for form controls. Co-locate `<Name>.stories.tsx` with the component.
- **Lead with the overview grid.** First export is `AllVariants` (or `AllSizes`) — a labeled CSS grid: rows = variant, columns = size, axis labels in `var(--color-muted-foreground)`. This is the canonical visual reference.
- **No slop.** Because the grid already shows every variant × size, do **not** add per-variant or per-size stories — they are pure duplication. Likewise never add label-only stories (same component, different `children`/`href` text) that exercise no new prop. This is the single most common bloat; a typical component needs ~6–8 stories, not 30.
- **Then**: `Playground` (every control wired via `args` + `argTypes`), followed by the few stories the grid can't express (icons, loading, disabled, error, description…), and finally one `*Interaction` play test (`storybook/test`).
- **Sidebar order** is pinned via `options.storySort` in `.storybook/preview.ts` (`order: ["Components", ["Icon", "IconButton", …, "*"], "Compositions"]`). Within a single file, story order = export order (no `storySort.method`, so don't rely on alphabetical).
- **Real-world demos** that compose several components belong in `_composites/` stories, not as variations on a primitive's story file.

## Regulatory context

cytario operates in the medical device space (digital pathology). Key implications:

- **SOUP (IEC 62304)**: Runtime dependencies (react, react-aria-components) are SOUP when consumed in the medical device. Dev dependencies (storybook, vitest) are not.
- **Claims governance**: the marketing-claims doc (`src/docs/Guidelines/ApprovedClaims.mdx`) was removed in the C-613 overhaul. EU MDR Article 7 still treats advertising as labeling — claims must map to regulatory submissions. Recover the content from git history (or the #58 branch) before making marketing claims.
- **Accessibility**: WCAG 2.2 AA is required. Every component must pass addon-a11y (axe-core) checks. Teal-500 on white fails contrast for normal text.

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

## Comments

- Default to **no comments**. Well-named identifiers carry the meaning. Only
  add a comment when the _why_ is non-obvious (a hidden constraint, a subtle
  invariant, a workaround for a specific bug, behavior that would surprise a
  reader).
- Keep it to one short line. Never restate what the code says, never
  multi-paragraph commentary.
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
