# Instructions for Gemini, Codex, Hermes and other agents

Read these files first: `README.md`, `ARCHITECTURE.md`, `CODING_RULES.md`, `docs/API_CONTRACT.md` and `docs/TESTING.md`. Use https://angular.dev as the authoritative Angular documentation.

## Required workflow
- Inspect the actual repo, lockfile, installed versions and current API contracts before coding. Do not assume CI has passed.
- Keep TS in `src/app/features/<module>/` and HTML in `src/app/templates/<module>/`; use external `templateUrl` with correct relative paths.
- Keep generic UI primitives in `shared/ui/`; use Tailwind v4 tokens with static class literals. Prefer native and accessible HTML.
- Add both `id.json` and `en.json` entries for user-facing strings. Do not bloat `i18n.service.ts`.
- Use typed API contracts plus runtime validation. Preserve cursor/keyset pagination, timezone-qualified timestamps and backend-based tenant permissions.
- Never use demo identity, localStorage JWT, frontend route guards or hidden buttons as real authentication/security.
- For changes to existing routes/forms, preserve user-visible behavior and server contracts. New modules require loading, empty, error, forbidden, tests and mobile states.
- Use the generator for new features where appropriate and review the generated service, permissions and translations.
- Use local Bun quality commands when available. Report observed results and blockers; never claim green from code inspection alone. Do not trigger CI.
- Leave the draft PR unmerged until the Bun lockfile exists, appropriate LOCAL build/security checks pass and project backend integration is reviewed; CI is explicitly paused.

## Non-negotiable cross-browser UI policy

Read `docs/BROWSER_COMPATIBILITY.md` and `docs/UI_SYSTEM.md` before designing any UI. Do not add fixed-width application shells or viewport-size hacks. Preserve Plus Jakarta Sans Google Fonts plus local fallbacks, safe area handling, mobile touch targets, keyboard focus, table-local scrolling, text zoom, and all three modern browser engines. Browser size compatibility uses CSS pixels, not Retina pixel counts.

Run `bun run layout:check` alongside structure, i18n, lint, unit tests, production build and cross-browser Playwright. Resolve failures rather than suppressing them. If an Angular CDK dependency is proposed for actual non-CSS responsive behavior, document its necessity and test cleanup.

## Mandatory package manager policy

Canonical package manager: **Bun 1.4.4**. For installation use `bun install` (after lockfile migration: `bun install --frozen-lockfile`); for commands `bun run <script>`; for tooling `bunx`. Do not use npm, npx, pnpm or yarn. Keep Node.js as the Angular CLI runtime when required by Angular. `bunfig.toml` uses hoisted dependencies for compatibility.

GitHub Actions is disabled by user request due to usage limits. Never add workflow triggers, enable CI, or dispatch tests to Actions. Do not attempt to fabricate `bun.lock`; complete migration only in a networked local Bun installation. Read `docs/CI_PAUSED.md` and `docs/TESTING.md`.

## Reliability hardening

Read `docs/HARDENING.md` and `openapi/openapi.json` before changing API/auth/CRUD. A protected HTTP 401 must invalidate the client session and redirect to login; 403 must not discard the session. Never let stale session probe responses override newer logins. Cancel obsolete searches, commit cursor history only on success, and retry known expired cursors at the first page once. Update OpenAPI and TypeScript DTOs together; run `bun run contract:check`. New forms should reuse UiFormField, UiSelect, UiBreadcrumbs and timezone-aware input policies. Bun-only local verification; NEVER trigger GitHub Actions.

## Paper visual-system standard

Read `docs/PAPER_VISUAL_SYSTEM.md` before adding new UI modules. Maintain the compact operations toolbar/sidebar, cyan `brand-*` theme, semantic `app-panel`/`app-eyebrow`, Plus Jakarta Sans and JetBrains Mono for technical values. Honor persisted light/dark preferences, mobile navigation, focus, reduced motion and table-local scrolling. Use the external HTML template convention and avoid copying unrelated business logic or dependencies from the design reference. Never show fabricated KPIs/system status. No CI/Actions.
