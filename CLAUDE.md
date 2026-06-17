# CLAUDE.md - cytario-design

## Project Overview

This is the **cytario design system** — the single source of truth for the cytario corporate identity. It covers brand foundation (logos, colors, typography) and production-ready React UI components, served as an interactive Storybook portal.

cytario is a digital pathology / spatial biology company. The design system serves developers, designers, marketing, and regulatory affairs.

## Tech Stack

- **Storybook 10** (with MDX documentation pages, addon-a11y, addon-docs)
- **React 18 + 19** + **TypeScript 5.9** (strict mode) — components support React 18 and 19; CI tests against both via matrix
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, `@theme` block in `src/styles/tailwind.css`)
- **React Aria Components** (Adobe) — headless accessible primitives for all interactive components
- **Style Dictionary v4** — transforms W3C DTCG token JSON into CSS custom properties and TypeScript constants
- **Vitest** + **React Testing Library** for component tests
- **npm** as package manager

## Project Structure

```
.storybook/           # Storybook config (main.ts, preview.ts, theme.ts, manager.ts)
assets/
  logos/              # SVGO-optimized SVG logo variants + PNGs
  approvals/          # Agency approval PDFs (reference only)
tokens/
  base.json           # Primitive tokens (colors, spacing, typography) in W3C DTCG format
  semantic.json       # Semantic aliases referencing base tokens
scripts/
  build-tokens.ts     # Style Dictionary build script
src/
  tokens/
    variables.css     # AUTO-GENERATED — do not edit manually
    tokens.ts         # AUTO-GENERATED — do not edit manually
  styles/
    tailwind.css      # Tailwind v4 @theme with brand color scales
    global.css        # Imports tailwind.css + variables.css, global styles
  components/         # React components (co-located: .tsx + .stories.tsx + .test.tsx)
    Button/           # Primary, secondary, ghost, destructive variants
    Input/            # TextField with label, error, description
    Select/           # Dropdown with popover, keyboard nav
    Table/            # Sortable data table, compact/comfortable sizes
  docs/               # MDX documentation pages
    Introduction.mdx
    Foundation/       # Logo, Colors, Typography, Spacing
    Guidelines/       # BrandGuidelines, ApprovedClaims
```

## Key Commands

```bash
npm install              # Install dependencies
npm run build:tokens         # Generate CSS/TS from token JSON (run after changing tokens/)
npm run dev                  # Start Storybook at http://localhost:6006
npm run build                # Build static Storybook to storybook-static/
npx vitest run        # Run all tests once
npm run lint                 # ESLint on src/
```

## Brand Colors

- **Purple `#5c2483`** — primary brand color (wordmark). Token: `--color-purple-700` / `--color-brand-primary`
- **Teal `#35b7b8`** — accent color (icon, primary actions). Token: `--color-teal-500` / `--color-brand-accent`
- Both have full 50-900 scales in `tokens/base.json`
- Teal-500 fails WCAG AA contrast on white for normal text — use teal-700 (`#217d7e`) or darker for text

## Design Token Pipeline

```
tokens/base.json + tokens/semantic.json (W3C DTCG JSON)
  -> Style Dictionary v4 (scripts/build-tokens.ts)
  -> src/tokens/variables.css (CSS custom properties with --color-*, --spacing-*, etc.)
  -> src/tokens/tokens.ts (TypeScript constants)
```

After modifying tokens, run `npm run build:tokens`. If adding a new color scale, also add entries to the `@theme` block in `src/styles/tailwind.css`.

## Component Architecture

All components follow the same pattern:

1. **Behavior + accessibility**: Wrap a React Aria Component (e.g., `Button`, `TextField`, `Select`, `Table`)
2. **Styling**: Tailwind v4 canonical utility classes. Use standard utilities where they exist (`font-semibold`, `text-sm`, `gap-4`, `rounded-md`), including the semantic color utilities generated from the design tokens (`bg-primary`, `text-muted-foreground`, `bg-destructive`, `border-border`). Use arbitrary token syntax (`bg-(--color-badge-purple-bg)`) only for the decorative `badge`/`delta`/`progress` palettes that are deliberately excluded from the `@theme` layer. Never use verbose forms like `[var(--spacing-4)]` or `(number:--font-weight-semibold)`.
3. **Stories**: CSF3 format, import from `storybook/react` and `storybook/test` (Storybook 10 paths)
4. **Tests**: Vitest + React Testing Library. Test by user perspective (query by role/label). Do not test React Aria internals.

### Storybook 10 Import Paths

These are different from Storybook 8:
- Stories: `import type { Meta, StoryObj } from "storybook/react"`
- Test utilities: `import { expect, fn, userEvent, within } from "storybook/test"`
- MDX blocks: `import { Meta } from "@storybook/addon-docs/blocks"`
- Theme: `import { create } from "storybook/theming/create"`
- Manager API: `import { addons } from "storybook/manager-api"`

Packages consolidated into `storybook` core (do NOT install separately): `@storybook/addon-essentials`, `@storybook/addon-interactions`, `@storybook/blocks`, `@storybook/test`.

## Storybook Configuration Notes

- **Tailwind**: `@tailwindcss/vite` is registered via `viteFinal` in `.storybook/main.ts` — this is required for Tailwind to work in Storybook
- **MDX tables**: `remark-gfm` is configured in addon-docs options to enable GFM markdown table syntax in MDX files
- **Theme**: Custom cytario theme in `.storybook/theme.ts` uses purple for sidebar/accents. Sidebar icon colors are overridden via CSS in `.storybook/manager-head.html`
- **Static assets**: `assets/` directory is served via `staticDirs` config — reference logos as `logos/cytario-logo-purple.svg` in MDX

## Regulatory Context

cytario operates in the medical device space (digital pathology). Key implications:

- **SOUP (IEC 62304)**: Runtime dependencies (react, react-aria-components) are SOUP when consumed in the medical device. Dev dependencies (storybook, vitest) are not.
- **Claims governance**: `src/docs/Guidelines/ApprovedClaims.mdx` is the authoritative source for marketing claims. EU MDR Article 7 treats advertising as labeling — claims must map to regulatory submissions.
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

## Commit Convention

This project uses **Conventional Commits** (`type(scope): description`). Common types:

- `feat:` — new feature (triggers minor version bump)
- `fix:` — bug fix (triggers patch version bump)
- `docs:` — documentation only
- `chore:` — tooling, CI, dependencies
- `refactor:` — code change that neither fixes a bug nor adds a feature
- `test:` — adding or updating tests

A `BREAKING CHANGE:` footer or `!` after the type triggers a major version bump.

Releases are automated via **semantic-release** — version bumps, changelogs, and npm publishing to GitHub Packages are all driven by commit messages on `main`.

## Pre-commit Checklist

- **Always run `npx vitest run` before committing** to ensure tests pass. Tests assert on class names, so any Tailwind class refactoring must update tests too.

## Common Pitfalls

- Do not install `@storybook/addon-essentials`, `@storybook/blocks`, or `@storybook/test` as separate packages — they are part of `storybook` core in v10
- Do not edit `src/tokens/variables.css` or `src/tokens/tokens.ts` — they are generated by `npm run build:tokens`
- Always use conventional commit format — semantic-release depends on it for versioning
- Storybook sidebar icon colors are controlled via CSS in `.storybook/manager-head.html`, not via the theme API
