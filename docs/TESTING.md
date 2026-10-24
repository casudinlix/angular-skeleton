# Local quality and release checklist (Bun)

GitHub Actions is deliberately disabled due to the user's Actions quota. **Do not dispatch CI workflows or rely on old GitHub test badges.** Use local Bun scripts and report the result.

## First-time Bun migration

```bash
bun --version
bun run lock:migrate            # imports the existing package-lock into bun.lock
bun install --frozen-lockfile   # validate the lockfile is reproducible
```

Commit `bun.lock` together with deletion of `package-lock.json`; do not use npm/pnpm/yarn afterwards. Angular CLI still needs a compatible Node.js installation, even though Bun installs and runs scripts.

## Checks (run locally only)

```bash
bun install --frozen-lockfile
bun run i18n:check
bun run structure:check
bun run layout:check
bun run check
bun run lint
bun run test
bun run test:coverage
bun run build
bunx playwright install chromium firefox webkit
bun run e2e
bun audit
```

The scripts operate on the local machine; nothing is sent to GitHub Actions. Chromium/Firefox/WebKit Playwright runners are local emulations and do not substitute for real iOS Safari / Android device testing.

## Required manual review

- Authenticated backend session restoration, invalid credentials, logout failures, CSRF checks and permission denial across tenants.
- Customer validation, CRUD, cursor/ordering stability, mobile keyboard navigation and dialogs.
- Responsive widths: 280 stress, 320, 360, 375, 390, 430, 600, 768, 1024, 1280, 1440 and 1920 CSS px; 200%+ text scaling, short landscape, dark/light, high-DPI assets.
- Verify sensitive values never appear in browser storage, public assets, logs, URLs or telemetry.
- Inspect build artifacts, dependency advisory results, CSP and reverse proxy behavior.

## Verification of this migration

No Bun executable or package registry was available in the current working environment, so **no local Bun install/build/tests have been executed**. Source and JSON configuration can be inspected, but lockfile migration and runtime checks must be carried out on a local system where Bun is installed.

Historic GitHub Actions successes belong to the previous npm-backed commits. They must not be presented as validation of this Bun migration. CI stays disabled until the user explicitly re-enables it.

## Additional local hardening verification

Run `bun run contract:check` to validate OpenAPI schemas and customer field parity. New test specifications cover stale session races, 401 and backend recovery, blocked preference storage, request cancellation, cursor history and UiSelect ControlValueAccessor. These tests have not been executed for this branch in this environment. GitHub Actions remains disabled.

## Local demo and dependency regression checks

```sh
bun install --frozen-lockfile
bun run deps:check
bun run demo:config:check
bun run demo:test
bunx playwright install chromium webkit
bun run demo:e2e
```

The manifest and committed Bun lockfile must both resolve TypeScript 6.0.x with Angular 22. Major upgrades are blocked in Dependabot until reviewed. The demo browser suite uses the real **localhost-only** synthetic API, and never requires GitHub Actions. The browser tests and build in this branch have not been executed by the editing environment.
