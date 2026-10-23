# Paper-inspired operations console design

## Reference and intention

Inspired by the visual language of the user's `casudinlix/paper-ai-studio-billing` repository. **Adapt its appearance only**, not its billing routes, simulated status, mock subscriber counts, runtime services, frameworks or packages.

Compared to the previous Skeleton UI, this direction uses a horizontal 68px operations toolbar, dense 248px sidebar, restrained modular cards, fine slate borders, cyan primary actions and monospace technical metadata. The work preserves the same Angular route tree and business behavior.

## Foundations

| Area | Dark (default for new sessions) | Light |
| --- | --- | --- |
| Page | `console-950 #030712` | `slate-50` |
| Sidebar | `console-900 #0b1220` | `console-900` (stable navigation contrast) |
| Cards | `#111827` / `slate-800` border | white / `slate-200` border |
| Primary | cyan / `brand-400 #22d3ee` | `brand-600 #0891b2` |
| Body | Plus Jakarta Sans | Plus Jakarta Sans |
| Technical data | JetBrains Mono | JetBrains Mono |

The brand alias remains `brand-*` so existing directives and page templates continue to work. `app-panel`, `app-eyebrow` and `app-mono` are shared presentation utilities. Keep Tailwind v4 CSS-first tokens in `src/styles.css`.

### Typography

- Plus Jakarta Sans from Google Fonts: application content, labels and navigation.
- JetBrains Mono: IDs, counters, versions and metadata only; no long blocks of body copy.
- System font fallbacks are mandatory. Do not make functionality depend on remote font delivery.

### Layout

- Full-width horizontal top bar. No invented network status, fake KPI or billing actions.
- Desktop: sidebar navigation, separate page outlet and subtle footer.
- Mobile: focusable menu button, accessible modal-like navigation surface, dismiss overlay, menu closes after navigation. Buttons and form controls keep accessible hit areas.
- At 280–320 CSS px and large text: allow header actions to wrap. Never disable browser zoom or hide page overflow to mask layout bugs.
- Tables scroll locally in `app-scroll-region`, not the document. Dialogs scroll internally on short viewports.

### App behavior

- Dark is the first-visit default; the existing `skeleton.theme` preference is still honored. Light remains fully supported. Theme toggles are functional, not decorative.
- Internationalization stays in `id.json` and `en.json`. Shell labels use typed I18nService keys.
- Route guards, HTTP contracts, permissions, forms, cursor pagination, dialogs, recovery and toaster behavior are unchanged.
- Future modules generated through Bun or the local schematic start from `app-panel` rather than ad-hoc styling.
- SVG branding was recolored to cyan; no raster-only assets were introduced.

## Developer rules

- **Do not copy** runtime packages from the reference app (`@angular/material`, charts, React/Recharts, Leaflet, Stripe etc.) purely for visual styling.
- Retain Angular 22 / TypeScript 6 compatibility, Bun package manager and committed Bun lockfile.
- Avoid giant KPI cards with fake data, always-on glowing gradients, tiny unreadable controls, or dense tech labels that replace clear accessible names.
- Respect semantic HTML, screen readers, keyboard focus, reduced motion, contrast, RTL-safe layout where appropriate, and light/dark color combinations.
- Add new semantic colors to `@theme` instead of hardcoding per-component hex values. Use explicit full class strings so Tailwind can statically detect them.
- Keep all HTML templates in `src/app/templates/<module>/`, TS logic in `features/<module>/` and shared components in `shared/ui/`.

## Local verification (GitHub Actions paused)

```sh
bun install --frozen-lockfile
bun run toolchain:check
bun run i18n:check
bun run structure:check
bun run layout:check
bun run lint
bun run test
bun run build
bun run e2e
```

This branch was authored without a local Bun binary or configured registry, so it has not been compiled or browser-verified here. Perform local checks and visual QA before merging. No GitHub Actions workflows were added or triggered.
