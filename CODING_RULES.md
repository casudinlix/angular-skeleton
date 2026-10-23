# Coding rules

1. Follow https://angular.dev/style-guide, Angular 22 standalone components, TypeScript strict mode, `inject()`, signals and OnPush. Avoid NgModules for new features.
2. Keep all HTML in `src/app/templates/<module>/` and logic/services/types/specs in `src/app/features/<module>/`. Component `templateUrl` is relative to its TypeScript file. Do not write large inline component templates.
3. Put user-facing translations in both `src/app/core/i18n/locales/id.json` and `en.json`. Use `I18nService.translate()` with typed keys. Run `bun run i18n:check`.
4. Store public brand/image/icon/font assets in `public/assets/<type>/`. Never include private data, tokens, user uploads or secrets.
5. Use Tailwind CSS v4 and its semantic design tokens; do not create dynamic class fragments or add random global overrides. Build reusable primitives in `shared/ui/`.
6. Use reactive forms and typed validators. Inputs require proper label, keyboard focus, error, loading, disabled and empty states.
7. Keep API DTOs typed and validate untrusted responses at boundaries; do not use `any`, unchecked assertions or `as unknown as`.
8. Client route guards and permission-aware buttons are UX only. All operations require server-side authentication, authorization, CSRF defense and tenant isolation.
9. Frontend never stores tokens in localStorage. Use same-origin secure HttpOnly cookie sessions, server-supplied CSRF cookie/header, and safe error messages.
10. Backend lists default to cursor pagination, support stable sorting and avoid OFFSET; handle invalid cursors and reset on mutation.
11. Dates from backend use ISO 8601 with UTC/offset. Format with Intl and explicit application/user timezone, never assume the browser timezone equals business timezone.
12. New modules use `bun run generate:feature -- <name>` or the schematic, then adapt types, auth permission, both locales, tests and route labels.
13. Before merge: `bun run i18n:check`, `bun run structure:check`, `bun run check`, `bun run lint`, `bun run test`, `bun run build`, `bun run e2e` and vulnerability scanning. If not run, state that clearly.

## Browser compatibility and responsive rules (mandatory)

- Support Angular 22's official widely-available Web Platform Baseline. Never promise obsolete browsers (IE/unsupported WebViews); never expand Angular CLI browserslist beyond its supported targets.
- Every component must reflow at CSS viewport widths **280/320/360/375/390/430/600/768/1024/1280/1440/1920**, in portrait and landscape as relevant. Zoom and OS text scaling must not hide controls or produce document-level horizontal scrolling.
- Use mobile-first Tailwind CSS v4, `min-w-0`, `max-w-full`, `flex-wrap`, intrinsic Grid `minmax(0,1fr)`, relative sizes and shared responsive primitives. Avoid fixed widths, `overflow-x-hidden` as a cover-up, browser sniffing and unnecessary viewport JavaScript.
- Wide tables must have `app-scroll-region`, an accessible label and `tabindex="0"`; dialogs must constrain dimensions and scroll inside small viewports.
- Honor mobile safe areas, stable/dynamic viewport unit fallbacks, >=16px form controls on mobile Safari, keyboard focus, reduced motion and >=44px preferred tap targets. Do not disable user zoom.
- **Plus Jakarta Sans** via Google Fonts is the standard UI font. Preserve a system font fallback. SVG assets are preferred for high-density (Retina/HiDPI) screens; CSS breakpoints depend on CSS pixels, not device pixel ratio.
- Run `bun run layout:check` and the Chromium/Firefox/WebKit/iOS-WebKit/Android-Chromium/Retina Playwright suite. Review on real Apple and Android devices for production.
- Read `docs/BROWSER_COMPATIBILITY.md` before creating or revising UI. Browser compatibility is a release gate, not an optional visual check.

## Package manager and CI restrictions

- **Bun 1.4.4 only** for installing/updating dependencies and running scripts: `bun install`, `bun add`, `bun remove`, `bun run <script>`, `bunx`. Do not introduce npm/pnpm/yarn commands or a second lockfile after migration.
- Maintain `bun.lock` as the single lockfile after the initial migration. Until migration is completed locally, `package-lock.json` is a temporary source for Bun import, not permission to run npm.
- Retain supported Node.js for Angular CLI compatibility, even though dependency management uses Bun.
- **Never run, enable, dispatch, or add GitHub Actions/CI workflows** while the user has paused CI due to quota. Run requested checks locally if possible and clearly state any checks not executed.

## Session, API, and form hardening

- Handle expired sessions (401), forbidden resources (403), unavailable backend/retry, and races between session operations deliberately.
- Abort obsolete GET requests and update cursor/back-stack only after success. Do not auto-replay non-idempotent mutations or 429 responses.
- Machine contract: `openapi/openapi.json`. Update API definitions, runtime DTO parsing and field parity together, then run `bun run contract:check`.
- Form UI uses UiFormField for labels/errors, UiSelect ControlValueAccessor for reactive forms, UiBreadcrumbs and native date/time controls. Do not treat datetime-local strings as UTC without an explicit timezone.
- Run only LOCAL Bun quality checks. CI/GitHub Actions remains off.

## Visual system: Paper operations console

- New UIs must follow `docs/PAPER_VISUAL_SYSTEM.md`: dark-first, cyan accents, compact header and navigation, slim bordered data cards and deliberate data density.
- Reuse CSS-first Tailwind v4 design tokens and shared `app-panel`/`app-eyebrow` styles. Avoid per-module conflicting hex values.
- Plus Jakarta Sans for content and JetBrains Mono for technical metadata. Both need offline system fallbacks.
- Light mode must remain legible; CSS semantics must account for both light and dark. Honor saved preferences and test both.
- Do not import Angular Material, chart libraries, React or billing runtime packages just to reproduce the reference aesthetic. New dependencies require a separate verified need.
- Preserve all routes, HTTP contracts, permissions, forms and localized UI during restyles. Do not invent financial metrics or live network statuses.
