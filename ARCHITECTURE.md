# Architecture decision record: Angular skeleton

## Why Angular
Angular 22 standalone features, built-in DI, functional guards/interceptors, a production application builder and a well-defined testing pipeline offer a disciplined template for multiple internal applications.

## Rules
1. **Feature-first**: logic, models, services and tests live in `features/<module>/`. Reusable UI primitives go in `shared/ui/`; cross-cutting infrastructure belongs in `core/`.
2. **External templates**: `templates/<module>/` contains all Angular HTML files. This intentionally differs from Angular's default colocated structure. Run `bun run structure:check` after moving TypeScript or HTML.
3. **Secure-by-default navigation**: Angular route guards improve UX, but backend validates session/tenant/resource-level permissions. No fake login identity.
4. **One origin**: frontend calls only `/api/*` with secure cookies. Dev server proxies to Bun backend on port 3000; production reverse proxy provides the same path. HttpClient uses Angular's built-in XSRF handling (cookie XSRF-TOKEN and header X-XSRF-TOKEN).
5. **API boundary**: parse untrusted JSON in feature-specific adapters. Contract must be mirrored in an OpenAPI spec when integrating a real backend.
6. **State**: signals for local synchronous UI, RxJS for HttpClient and lifecycle-bound subscriptions. No global megastore without demonstrated need.
7. **Pagination**: opaque cursor/keyset contract, stable backend ordering, no OFFSET for large datasets; list refresh resets the pagination history.
8. **Internationalization**: static typed JSON translations ID/EN, no inline dictionary in services. Intl for locale-aware numbers/dates, explicit Asia/Jakarta default timezone.
9. **Visual system**: Tailwind v4 CSS-first with shared design tokens; native dialog improves keyboard/focus handling.
10. **Quality**: Angular build template checks, ESLint, Vitest, Playwright and package audits run locally with Bun while GitHub Actions is paused. Commit bun.lock for repeatable installs.

## Explicit exclusions
- No authentication backend, payment processing, tenant DB, or identity issuer inside this frontend repository.
- Do not treat browser permissions, localStorage or frontend DTO types as trusted security controls.
- SSR is not required for authenticated CMS; evaluate per product if a public SEO route is added.

## Browser and layout architecture

Browser targets follow Angular 22's documented Baseline. UI is CSS-first with intrinsically sized flex/grid containers; no framework viewport service is required for the current application shell. `src/styles.css` owns viewport, safe-area, touch and overflow primitives, and uses Google Fonts Plus Jakarta Sans plus OS fallbacks. Prefer SVG or correctly sized responsive raster assets over separate Retina-specific layouts.

Accessibility and responsive regressions are detected through `scripts/check-layout.mjs` and Playwright testing on Chromium, Firefox, WebKit, emulated Android/iOS and DPR2. Real-device Safari and Android acceptance testing is still required before production deployment. See `docs/BROWSER_COMPATIBILITY.md`.

## Package management and CI policy

- Bun **1.4.4** is the canonical dependency manager and script runner. Node.js remains required by the Angular CLI at its supported version; do not force `bunx --bun` on the Angular CLI.
- `package-lock.json` is retained temporarily solely as a migration seed because a networked Bun environment was unavailable during this change. Execute `bun run lock:migrate` locally, inspect `bun.lock`, then commit the new lockfile and removal of the old file.
- GitHub Actions automatic workflows are removed at the user's request. Use local quality checks. Do not re-enable CI without authorization.
