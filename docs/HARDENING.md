# Enterprise skeleton hardening

This changeset starts from merged `main` in branch `feat/enterprise-hardening-bun-auth-api`.

## Implemented

- **Session lifecycle**: protected API HTTP 401 invalidates frontend identity and redirects to login; 403 preserves session. Session probes use revision-aware restoration to avoid overwriting a newer login. Backend-unavailable states support explicit retry with a preserved destination.
- **Browser preferences**: a shared preference storage adapter catches browser `SecurityError`; language/theme preferences are optional and no credentials are put in localStorage.
- **Customer data**: unsubscribe obsolete HttpClient GET subscriptions, debounce search, and commit cursor and previous-page history only on successful page fetch. Known expired or invalid cursors (400/410/422) recover to page one once.
- **API contract**: `openapi/openapi.json` describes session/customer operations, customer inputs/pages, error envelopes, cookie session security and CSRF header. `bun run contract:check` verifies required endpoints, schemas and TypeScript model fields. DTOs are still handwritten pending full codegen integration.
- **Form/UI**: reusable external-template UiFormField, UiSelect with ControlValueAccessor, UiBreadcrumbs, and native UiDateTimeInputDirective. Sample Customers editor uses the form/select components.
- **Regression specs**: session expiry and recovery, stale probes, blocked localStorage, request cancellation, expired cursors and select value propagation.

## Local checks (no GitHub Actions)

```bash
bun run contract:check
bun run i18n:check
bun run structure:check
bun run layout:check
bun run lint
bun run test
bun run build
bunx playwright install chromium firefox webkit
bun run e2e
```

GitHub Actions must remain disabled. No CI workflow has been enabled or dispatched by this change. Bun is not installed in the editing environment, so no Angular build, unit tests or browser E2E tests for this branch have been executed there.

## Bun lockfile migration remains local

The merged `main` had a legacy npm lockfile but no generated `bun.lock`. A genuine Bun lockfile requires Bun and access to the registry/cache; it cannot be assembled safely by hand. On a machine with the pinned Bun 1.4.4:

```bash
bun run lock:migrate
bun install --frozen-lockfile
bun run quality
git add -A bun.lock package-lock.json package.json
git commit -m "build: complete Bun lockfile migration"
```

The migration helper validates the real Bun lockfile with `bun install --frozen-lockfile --dry-run` before deleting the legacy npm lockfile. If validation fails, the old file is retained.

## Backend and deployment obligations

The real backend must verify session cookies and CSRF, enforce tenant/resource authorization on every API call, validate schema and cursors, and handle authentication expiry/rate limits. Browser-side permission checks and mocked HTTP tests are not security controls. For datetime-local inputs, supply a documented timezone conversion before sending timezone-qualified timestamps. Cross-browser testing on physical iOS/Android devices remains part of production acceptance.

This PR should remain **draft** until Bun migration and local verification have been performed and a real backend integration review has passed.
