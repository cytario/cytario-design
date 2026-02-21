# cytario design system

Single source of truth for the cytario corporate identity -- from brand foundation (logos, colors, typography) to production-ready React components. Built as an interactive Storybook portal for designers, developers, and stakeholders.

## Tech stack

| Layer | Technology |
|---|---|
| Documentation | Storybook 10, MDX |
| UI framework | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, CSS custom properties |
| Accessibility | React Aria Components (Adobe) |
| Design tokens | W3C DTCG JSON, Style Dictionary v4 |
| Testing | Vitest, React Testing Library, axe-core (addon-a11y) |

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10+ (`corepack enable` to activate the bundled version)

### Install and run

```bash
pnpm install
pnpm build:tokens   # generate CSS variables + TypeScript constants from token JSON
pnpm dev             # start Storybook at http://localhost:6006
```

## Project structure

```
cytario-design/
  .storybook/          # Storybook configuration (main.ts, preview.ts, theme.ts)
  assets/
    logos/              # SVG and PNG logo variants (full, reduced, black, white, on-purple)
    fonts/              # Montserrat font files
    approvals/          # approved brand materials
  tokens/
    base.json           # primitive color, spacing, typography tokens (W3C DTCG)
    semantic.json       # semantic aliases referencing base tokens
  scripts/
    build-tokens.ts     # Style Dictionary build script
  src/
    tokens/
      variables.css     # auto-generated CSS custom properties (do not edit)
      tokens.ts         # auto-generated TypeScript constants (do not edit)
    styles/
      tailwind.css      # Tailwind v4 @theme configuration
      global.css        # global styles and font-face declarations
    components/
      Button/           # Button.tsx, Button.stories.tsx, Button.test.tsx
      Input/            # Input.tsx, Input.stories.tsx, Input.test.tsx
      Select/           # Select.tsx, Select.stories.tsx, Select.test.tsx
      Table/            # Table.tsx, Table.stories.tsx, Table.test.tsx
    docs/               # MDX documentation pages (Introduction, Foundation, Guidelines)
```

## Design tokens

Tokens follow the W3C Design Token Community Group (DTCG) format and live in `tokens/`.

**Pipeline:**

```
tokens/base.json + tokens/semantic.json
  -> Style Dictionary v4 (scripts/build-tokens.ts)
  -> src/tokens/variables.css   (CSS custom properties)
  -> src/tokens/tokens.ts       (TypeScript constants)
```

Semantic tokens reference base tokens using `{color.purple.700}` syntax.

### Adding or modifying tokens

1. Edit `tokens/base.json` (primitives) or `tokens/semantic.json` (aliases).
2. Run `pnpm build:tokens` to regenerate the output files.
3. If you added a new color scale, also add matching entries to `src/styles/tailwind.css` under the `@theme` block so Tailwind utility classes are available.

**Do not edit `src/tokens/variables.css` or `src/tokens/tokens.ts` directly** -- they are overwritten on every build.

## Component development

Each component follows the same file structure:

```
src/components/ComponentName/
  ComponentName.tsx           # implementation
  ComponentName.stories.tsx   # Storybook stories (CSF3)
  ComponentName.test.tsx      # Vitest + React Testing Library tests
```

### Approach

- **Behavior and accessibility**: React Aria Components provide keyboard navigation, ARIA attributes, and focus management out of the box. Components wrap React Aria primitives with cytario styling.
- **Styling**: Tailwind CSS v4 utility classes referencing design token CSS custom properties (e.g., `bg-[var(--color-action-primary)]`). No runtime CSS-in-JS.
- **Stories**: CSF3 format with `args`, `argTypes`, and `play` functions for interaction tests. All stories are automatically checked by the a11y addon (axe-core).
- **Tests**: Vitest with React Testing Library. Test by user perspective -- query by role and label, verify behavior and accessibility attributes. Do not test React Aria internals.

### Creating a new component

1. Create `src/components/YourComponent/YourComponent.tsx`. Wrap the appropriate React Aria primitive, apply token-based Tailwind classes.
2. Create `YourComponent.stories.tsx` with a default meta, individual variant stories, a playground story, and at least one `play` function interaction test.
3. Create `YourComponent.test.tsx` covering rendering, user interaction, disabled/error states, and keyboard accessibility.
4. Export from a barrel file if one exists, or import directly.

## Brand colors

The cytario brand is built on two primary colors:

| Color | Hex | Token | Usage |
|---|---|---|---|
| Purple | `#5c2483` | `--color-purple-700` / `--color-brand-primary` | Primary brand color, headings, secondary actions |
| Teal | `#35b7b8` | `--color-teal-500` / `--color-brand-accent` | Accent color, primary actions, interactive elements |

Both colors have a full 50--900 scale defined in `tokens/base.json` for use in hover states, backgrounds, and subtle tints.

## Available components

| Component | Variants | React Aria primitive |
|---|---|---|
| Button | primary, secondary, ghost, destructive (sm/md/lg) | `Button` |
| Input | text, email, password, number; error + description states | `TextField` |
| Select | single-select dropdown with search | `Select` |
| Table | sortable columns, row selection | `Table` |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Storybook dev server on port 6006 |
| `pnpm build` | Build static Storybook site to `storybook-static/` |
| `pnpm build:tokens` | Generate CSS and TypeScript from token JSON |
| `pnpm test` | Run Vitest test suite (watch mode) |
| `pnpm test -- --run` | Run tests once (CI mode) |
| `pnpm lint` | Lint `src/` with ESLint |

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.

"cytario" and the cytario logo are trademarks of Slash-m GmbH. See [TRADEMARK.md](TRADEMARK.md).
