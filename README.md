# Angular Skeleton

Reusable Angular 22 frontend foundation for enterprise admin panels. Includes standalone components, strict TypeScript, signals, lazy routes, Tailwind CSS v4, Plus Jakarta Sans, ID/EN JSON, responsive shell, authenticated API contracts and cursor-pagination CRUD.

## Local setup (Bun is required)

- **Bun 1.4.4** is the package manager and script runner.
- Keep Node.js **22.22.3+**, or another Angular 22-compatible version, installed because Angular CLI still uses Node.js.
- A real backend is needed for authenticated features under `bun start`. To explore without a backend, use the opt-in local demo (`bun run demo`).

### Bun dependency compatibility

The repository already contains a real `bun.lock`. Keep it in sync with `package.json` and install via:

```sh
bun install --frozen-lockfile
bun run deps:check
bun run toolchain:check
```

Angular 22 requires **TypeScript 6.0.x**. The pinned Bun dependency snapshot is restored to `typescript@6.0.3`. Dependabot must not upgrade TypeScript to 7 without an Angular compatibility review.

### Development and local verification

```bash
bun install --frozen-lockfile
bun run start   # connect to your real backend at 127.0.0.1:3000
# or: bun run demo  # start standalone synthetic API + Angular demo together
bun run i18n:check
bun run structure:check
bun run layout:check
bun run check
bun run lint
bun run test
bun run build
bunx playwright install chromium firefox webkit
bun run e2e
```

Angular CLI, Vitest and Playwright are still the underlying tools. Bun replaces the **package manager and command runner**, not the Angular browser build tooling.

## Architecture

```text
src/app/
├── core/                 # Sessions, HTTP, i18n, locale, theme
├── features/             # Auth, customers, home, error routes
├── shared/ui/            # Accessible UI primitives
├── templates/            # HTML per feature/module
└── app.routes.ts
public/assets/           # Static branding, icons, images and fonts
tools/                   # Feature generator + Angular schematic
scripts/                 # Structure, i18n, responsive checks and Bun migration helper
```

Start a module using `bun run generate:feature -- orders`, or `bunx ng generate ./tools/schematics/collection.json:feature --name orders --dry-run`. Update both JSON locales and backend authorization contracts for real modules.

## Browser compatibility

Read [Browser & Responsive Standards](docs/BROWSER_COMPATIBILITY.md). Cross-browser layout testing covers Chromium, Firefox, WebKit, mobile emulations and high-DPI; Plus Jakarta Sans is served from Google Fonts with a system font fallback.

## CI quota policy

**GitHub Actions is disabled, and no CI tests are being run.** Perform checks locally with Bun. The previous automatic workflow was removed from `.github/workflows/` to avoid consuming Actions minutes. See [CI Paused](docs/CI_PAUSED.md) and [Local Testing](docs/TESTING.md).

## References

- [Architecture](ARCHITECTURE.md), [Coding Rules](CODING_RULES.md), [Agent Rules](AGENTS.md)
- [Backend Contract](docs/API_CONTRACT.md), [UI System](docs/UI_SYSTEM.md), [Browser Compatibility](docs/BROWSER_COMPATIBILITY.md)
- [Local Testing](docs/TESTING.md), [Reliability Hardening](docs/HARDENING.md), [OpenAPI Contract](openapi/openapi.json), [Deployment](docs/DEPLOYMENT.md), [Security](SECURITY.md)

## Readiness

A Bun lockfile is committed. Frontend dependency compatibility, smoke tests and browser E2E must be verified locally before merging the current changes. The sample/demo backend is never a substitute for production authentication, CSRF protection or tenant isolation.

## API reliability and reusable forms

OpenAPI 3.1: `openapi/openapi.json`. Validate contract/TypeScript field parity with `bun run contract:check`. Session recovery, 401/403 semantics, cancellation of obsolete HTTP searches and atomic cursor navigation are documented in `docs/HARDENING.md`.

Shared UI includes UiFormField, UiSelect ControlValueAccessor, UiDateTimeInputDirective and UiBreadcrumbs. The reference customer CRUD editor now uses them. Native datetime-local values contain no timezone offset and need explicit interpretation before API submission.

## Paper-style operations console

The default visual direction now draws from the team's `paper-ai-studio-billing` concept: dense operations toolbar, dark slate surfaces, cyan highlights, Plus Jakarta Sans, JetBrains Mono metadata, compact cards and a mobile drawer. This is a **styling adaptation**, not a port of the billing feature set. The first-visit theme is dark; saved theme preferences and light mode continue to work. See [Paper Visual System](docs/PAPER_VISUAL_SYSTEM.md).

To inspect locally: `bun run start`. GitHub Actions remains disabled per repository policy.

## Demo sample pages without a backend

When the Vite proxy reports `ECONNREFUSED 127.0.0.1:3000`, Angular is running but its real backend is absent. Use **`bun run demo`** to launch a localhost-only synthetic session/customer API and Angular together. Sign in using `demo@example.test` / `demo12345`; the UI clearly displays a demo badge and the sample data is reset when stopped. Production and regular `bun start` do not enable mocks. Full details: [Local Demo API](docs/LOCAL_DEMO.md).

## Local demo reliability and browser test

- `bun start`: normal frontend, requires a real backend at `127.0.0.1:3000`.
- `bun run demo`: loopback-only demo launcher. It refuses extra serve arguments (for example `--host 0.0.0.0`) so its public test credentials are not exposed on the LAN.
- `bun run demo:config:check`: checks demo build isolation and proxy settings without running the frontend.
- `bun run demo:test`: local Node integration checks, including rejection of foreign browser Origin headers.
- `bun run demo:e2e`: locally starts the actual demo API and Angular and exercises login, cursor navigation, create/search and logout in Chromium and WebKit emulations. This **never** triggers GitHub Actions.

The `deps:check` script protects the Angular 22/TypeScript 6 contract on both the manifest and Bun lockfile. See [Local Demo](docs/LOCAL_DEMO.md).
