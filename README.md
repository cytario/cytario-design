# cytario design system

Single source of truth for the cytario corporate identity -- from brand foundation (logos, colors, typography) to production-ready React components. Built as an interactive Storybook portal for designers, developers, and stakeholders.

## Tech stack

| Layer | Technology |
|---|---|
| Documentation | Storybook 10, MDX |
| UI framework | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS v4, CSS custom properties |
| Accessibility | React Aria Components (Adobe) |
| Design tokens | CSS custom properties (`src/styles/theme.css`) |
| Testing | Vitest, React Testing Library, axe-core (addon-a11y) |

## Getting started

### Prerequisites

- Node.js 22+

### Install and run

```bash
npm install
npm run dev            # start Storybook at http://localhost:6006
```

## Project structure

```
cytario-design/
  .storybook/          # Storybook configuration (main.ts, preview.ts, theme.ts)
  assets/
    logos/              # SVG and PNG logo variants (full, reduced, black, white, on-purple)
    fonts/              # Montserrat font files
    approvals/          # approved brand materials
  scripts/
    validate-tokens.ts # CI script to verify dark-theme invariant
  src/
    styles/
      theme.css           # single hand-maintained token file — primitives, light/dark semantics, @theme inline
      tailwind.css        # Tailwind v4 entry point (imports theme.css)
      global.css          # global styles + font-face declarations (imports tailwind.css)
    components/
      Button/           # Button.tsx, Button.stories.tsx, Button.test.tsx
      Input/            # Input.tsx, Input.stories.tsx, Input.test.tsx
      Select/           # Select.tsx, Select.stories.tsx, Select.test.tsx
      Table/            # Table.tsx, Table.stories.tsx, Table.test.tsx
    docs/               # MDX documentation pages (Introduction, Foundation, Guidelines)
```

## Design tokens

Tokens are hand-maintained in `src/styles/theme.css` — a single CSS file that is the source of truth:

- **Primitives** (`:root`): raw hex/rgba values (`--color-purple-500`)
- **Semantic light** (`:root`): `var()` refs to primitives (`--color-primary: var(--color-purple-500)`)
- **Semantic dark** (`[data-theme="dark"]`): overrides for every semantic token
- **`@theme inline`**: maps tokens to Tailwind v4 utility names

All token CSS lives in `@layer cytario-design` so consumer app styles can override.

### Adding or modifying tokens

1. Edit `src/styles/theme.css` directly.
2. If adding a new color scale, add entries in all four sections (primitives, light semantics, dark semantics, `@theme inline`).
3. Run `npm run validate:tokens` to verify the dark-theme invariant (every `:root` color has a `[data-theme="dark"]` counterpart).

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
- **Styling**: Tailwind CSS v4 utility classes, including the idiomatic semantic color utilities generated from the design tokens (e.g., `bg-primary`, `text-muted-foreground`, `bg-destructive`). No runtime CSS-in-JS.
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

Both colors have a full 50--900 scale defined in `src/styles/theme.css` for use in hover states, backgrounds, and subtle tints.

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
| `npm run dev` | Start Storybook dev server on port 6006 |
| `npm run build` | Build static Storybook site to `storybook-static/` |
| `npm run validate:tokens` | Verify dark-theme invariant in token CSS |
| `npm test` | Run Vitest test suite (watch mode) |
| `npx vitest run` | Run tests once (CI mode) |
| `npm run lint` | Lint `src/` with ESLint |

## License

This project is dual-licensed:

- **Open source**: [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-only)
- **Commercial**: A proprietary license is available from Slash-m GmbH for use cases where the AGPL is not suitable. Contact licensing@slash-m.com for terms.

"cytario" and the cytario logo are trademarks of Slash-m GmbH. See [TRADEMARK.md](TRADEMARK.md).
