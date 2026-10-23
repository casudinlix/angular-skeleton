# Angular Skeleton

Reusable Angular 22 frontend foundation for enterprise admin panels. Includes standalone components, strict TypeScript, signals, lazy routes, Tailwind CSS v4, Plus Jakarta Sans, ID/EN JSON, responsive shell, authenticated API contracts and cursor-pagination CRUD.

## Local setup (Bun is required)

- **Bun 1.4.4** is the package manager and script runner.
- Keep Node.js **22.22.3+**, or another Angular 22-compatible version, installed because Angular CLI still uses Node.js.
- A real backend is needed for authenticated features (development proxy defaults to http://localhost:3000).

### One-time migration from the legacy npm lockfile

The repository currently retains `package-lock.json` **only as an input to Bun's lockfile migration**. This environment cannot create a real `bun.lock`, because Bun and a package registry were unavailable. On your local machine:

```bash
bun --version            # recommended: 1.4.4
bun run lock:migrate     # bun install, create bun.lock, remove package-lock.json only after success
bun install --frozen-lockfile
git add -A package.json bunfig.toml bun.lock package-lock.json
git commit -m "build: complete Bun lockfile migration"
```

After migrating, `bun.lock` is the **only** lockfile to commit. Do not recreate `package-lock.json` or install project dependencies using npm, yarn or pnpm. See [Bun's installation documentation](https://bun.com/docs/pm/cli/install).

### Development and local verification

```bash
bun install --frozen-lockfile
bun run start
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

The previous skeleton has been merged to main. Hardening now lives on the separate branch `feat/enterprise-hardening-bun-auth-api`. Legacy npm lockfile migration to Bun remains **pending local execution**. No Bun install or tests have been executed for this package-manager change. Real backend session, CSRF, tenant isolation and permission tests are required before production deployment.

## API reliability and reusable forms

OpenAPI 3.1: `openapi/openapi.json`. Validate contract/TypeScript field parity with `bun run contract:check`. Session recovery, 401/403 semantics, cancellation of obsolete HTTP searches and atomic cursor navigation are documented in `docs/HARDENING.md`.

Shared UI includes UiFormField, UiSelect ControlValueAccessor, UiDateTimeInputDirective and UiBreadcrumbs. The reference customer CRUD editor now uses them. Native datetime-local values contain no timezone offset and need explicit interpretation before API submission.
